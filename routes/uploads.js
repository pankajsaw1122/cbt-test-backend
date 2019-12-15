const express = require('express');
var multer = require('../common/multer');
const sendResponse = require("../common/sendresponse");
var moment = require('moment');
var fs = require('fs-extra');
const router = express.Router();

router.post('/uploadImage', multer.upload.single('imagefile'), function (req, res, next) {
  // console.log('Upload image called');
  // var imagePath = 'uploads/' + req.file.filename;
  // sendResponse.sendResponseData(
  //   "Image upload success",
  //   { imagepath: imagePath },
  //   res
  // );

  if (req.file === undefined) {
    sendResponse.sendErrorMessage('Image not selected', {}, res); // send err message if unable to save data                
  } else {
    const mainImagePath = req.file.path;
    console.log('main image path === ' + mainImagePath);
    const destPath = 'public/uploads/' + moment().format('DDMMYYYY') + '/' + req.file.filename;
    console.log('dest image path === ' + destPath);
    let finalImagePath = destPath.substring(7, destPath.length);
    console.log('dest image path === ' + finalImagePath);
    fs.move(mainImagePath, destPath).then(() => {
      console.log('successfully moved!');
      console.log('Upload image path is ***************');
      console.log(finalImagePath);
      sendResponse.sendResponseData(
        "Image upload success",
        { imagepath: finalImagePath },
        res
      );
    }).catch(err => {
      console.error(err);
      error.statusCode = 400;
      error.data = err;
      next(err);
    });
  }



});

module.exports = router;