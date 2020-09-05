const aws = require('aws-sdk');
const fs = require('fs');

function uploadToAWS(fileName, res) {

    // Set the config
    aws.config.update({
        region: process.env.S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    });

    // create S3 service object
    const s3 = new aws.S3();

    // read the file
    fs.readFile(fileName, (err, data) => {

        // pare down the image name
        if (err) throw err;
        const params = {
            ACL: 'public-read',
            Bucket: process.env.S3_BUCKET,
            Key: `recipe_images/${fileName.substring(fileName.lastIndexOf('/') + 1)}`,
            Body: data
        };

        // upload the file
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded to AWS at ${data.Location}`)
            res.json({
                message: `File uploaded to AWS`,
                image_url: data.Location,
                image_file_name: data.Key
            })
        });
    });
}

// add logic to remove file from AWS, too
function deleteFromAWS(fileKey, res){

    // Set the config
    aws.config.update({
        region: process.env.S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    });

    // create S3 service object
    const s3 = new aws.S3();
    
    var params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
    };

    s3.deleteObject(params, function (err, data) {
        if (err) throw err;
        if (data) {
            res.json({
                message: `File deleted from AWS`
            })
        }
    });
}

module.exports = {uploadToAWS, deleteFromAWS};
