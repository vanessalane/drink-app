const router = require('express').Router();
const aws = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
var upload = multer({ dest: 'temp/' });
const { v4: uuidv4 } = require('uuid');

// Set the AWS config
aws.config.update({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

router.post('/delete', async (req, res) => {
    const fileKey = req.body.filekey

    // create S3 service object
    const s3 = new aws.S3();
    
    // define params for the deletion
    var params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
    };

    s3.deleteObject(params, function (err, data) {
        if (err) throw err;
        if (data) {
            res.json({
                message: `File deleted from AWS`,
                filekey: fileKey
            })
        }
    });
});

router.post('/upload', upload.single('imageFile'), async (req, res) => {

    // if there's a file, upload it
    if (req.file) {
        // create S3 service object
        const s3 = new aws.S3();

        // read the file
        const fileName = `temp/${req.file.filename}`;
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;

            // define params for the upload
            const params = {
                ACL: 'public-read',
                Bucket: process.env.S3_BUCKET,
                Key: `recipe_images/${uuidv4()}`,  // random file name
                Body: data
            };

            // upload the file
            s3.upload(params, function(s3Err, data) {
                if (s3Err) throw s3Err
                console.log(`File uploaded to AWS at ${data.Location}`)

                // clear out the temp file
                fs.unlinkSync(fileName);

                // return the data
                res.json({
                    message: "File uploaded to AWS",
                    image_url: data.Location,
                    image_file_name: data.Key
                })
            });
        });
    } else {
        res.json({
            message: "No file to upload",
            image_url: "",
            image_file_name: ""
        })
    }
});

module.exports = router;