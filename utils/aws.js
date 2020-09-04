var AWS = require('aws-sdk');
const fs = require('fs');

// Set the config
AWS.config.update({
    region: 'us-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY
    }
});

// create S3 service object
s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});

const uploadFile = (fileName) => {
    fs.readFile(fileName, (err, data) => {
        // pare down the image name
        const fileKey = fileName.substring(fileName.lastIndexOf('/') + 1)
        if (err) throw err;
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: fileKey,
            Body: data
        };
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`)
            return data.Location;
        });
     });
};

module.exports = {uploadFile};