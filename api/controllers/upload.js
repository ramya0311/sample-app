const mongoose = require('mongoose');
const imageUpload = mongoose.model('ImageUpload');
const formFields = mongoose.model('FormFields');
const multer = require('multer');
const fs = require('fs');
const _ = require('lodash');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, './images/'))
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
    }
});

const multer_upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});

var uploadImage = (req, res, img) => {
    return new Promise((resolve, reject) => {
        multer_upload.single(img.name)(req, res, (err) => {
            // read the img file from tmp in-memory location
            var newImg = fs.readFileSync(img.path);
            // encode the file as a base64 string.
            var encImg = newImg.toString('base64');
            // define your new document
            var newItem = {
                fileName: img.name,
                fileSize: img.size,
                file: Buffer(encImg, 'base64')
            };


            var imgUpload = new imageUpload(newItem)

            return imgUpload.save()
                .then((result) => {
                    return resolve(result);
                }).catch(err => reject(err));
        });
    });



}
module.exports.upload = (req, res) => {
    const newFormFields = new formFields(req.fields);
    var filesToUpload = req.files.fileToUpload;
    var promiseArray = [];
    for (var i = 0; i <= filesToUpload.length - 1; i++) {
        promiseArray.push(uploadImage(req, res, filesToUpload[i]));
    }

    Promise.all(promiseArray).then((results) => {
        const imgIds = _.map(results, o => _.pick(o, ['_id']));
        newFormFields.imgArray = imgIds;
        newFormFields.save((err) => {
            if (err) {
                res.status(500).send({ message: err.errmsg });
            } else {
                res.status(200).send({ message: 'File Upload Succesful' });
            }
        });
    }).catch((error) => {
        res.status(500).send({ message: err.errmsg });
    });
};