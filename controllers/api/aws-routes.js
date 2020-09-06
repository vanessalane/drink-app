const router = require('express').Router();
const aws = require('aws-sdk');

router.post('/delete', async (req, res) => {
    const fileKey = req.body.filekey
    
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

module.exports = router;