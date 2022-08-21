const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    smallDescription: {
        type: String,
        required: true
    },
    imgArray: {

    }
});

const imageSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    },
    file: {
        data: Buffer,
        contentType: String
    }
});

mongoose.model('FormFields', formSchema);
mongoose.model('ImageUpload', imageSchema);