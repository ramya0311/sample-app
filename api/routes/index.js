const ctrlUpload = require('../controllers/upload');
const express = require('express');
const router = express.Router();


// upload
router.post('/upload', ctrlUpload.upload);

module.exports = router;