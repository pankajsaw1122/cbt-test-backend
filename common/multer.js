var multer = require("multer");
const path = require("path");
const moment = require('moment');
var mkdirp = require('mkdirp');

var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});
exports.upload = multer({
    storage: storage
});