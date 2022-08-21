const mongoose = require('mongoose');
const imageUpload = mongoose.model('ImageUpload');
const formFields = mongoose.model('FormFields');
const multer = require('multer');
const fs = require('fs');
const _ = require('lodash');

//Fileupload Helpers
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

//SENDGRID Credentials
const SENDGRID_API_KEY = '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';
const SENDGRID_TEMPLATE_ID = 'd-fa7a77e048b64542b4953889c5ef3463';
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)


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

var sendEmail = (data) => {
    console.log('data', data);
    const msg = {
        to: data.email,
        from: 'fary.hey.nurse@gmail.com',
        templateId: SENDGRID_TEMPLATE_ID,
        dynamicTemplateData: {
            subject: 'Form Data Preview',
            first_name: data.firstName,
            last_name: data.lastName,
            user_name: data.firstName + ' ' + data.lastName,
            email: data.email,
            image_upload: data.filesUploaded,
            small_description: data.smallDescription
        }
    };
    return new Promise((resolve, reject) => {
        sgMail.send(msg)
            .then((response) => {
                console.log('Sendgrid response code', response[0].statusCode)
                console.log('Sendgrid response header', response[0].headers)
                return resolve();
            })
            .catch((error) => {
                console.error(error)
                return reject(error);
            })
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
                const data = req.fields;
                data.image_upload = filesToUpload.length;
                sendEmail(data).then(() => {
                    res.status(200).send({ message: 'File Upload Succesful' });
                }).catch((error) => {
                    res.status(500).send({ message: err });
                });
            }
        });
    }).catch((error) => {
        res.status(500).send({ message: err.errmsg });
    });
};