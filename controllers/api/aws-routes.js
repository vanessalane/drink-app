const router = require('express').Router();
const {uploadToAWS, deleteFromAWS} = require('../../utils/aws');

router.post('/upload', async (req, res) => {
    const fileName = req.body.filename
    const uploadedFile = uploadToAWS(fileName, res);
});

router.post('/delete', async (req, res) => {
    const fileKey = req.body.filekey
    const deletedFile = deleteFromAWS(fileKey, res);
});

module.exports = router;