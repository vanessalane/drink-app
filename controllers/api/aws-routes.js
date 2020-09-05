const router = require('express').Router();
const aws = require('aws-sdk');
const fs = require('fs');

router.post('/upload',
        (req, res) => {

    // Set the config
    aws.config.update({
        region: process.env.S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_ACCESS_SECRET
        }
    });

    // create S3 service object
    const s3 = new aws.S3();

    // read the file
    const fileName = req.body.filename;
    fs.readFile(fileName, (err, data) => {

        // pare down the image name
        const fileKey = fileName.substring(fileName.lastIndexOf('/') + 1)
        if (err) throw err;
        const params = {
            ACL: 'public-read',
            Bucket: process.env.S3_BUCKET,
            Key: `recipe_images/${fileKey}`,
            Body: data
        };

        // upload the file
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`)
            res.json({
                message: "success!",
                data
            });
        });
     });
});

module.exports = router;