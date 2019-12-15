const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const bcrypt = require('bcrypt');

exports.registerCandidate = (req, res, next) => {
    const fields = [req.body.fName, req.body.lName, req.body.rollNo, req.body.classes]
    let valid = validation.candidateRegisterValidate(fields);

    if (valid.error !== null) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        console.log("In else block");
        fields[4] = Math.floor(Math.random() * (99999999 - 10000000) + 10000000);
        fields[5] = moment().format('');
        // YYYY-MM-DD HH:MM:SS
        return db.execute(
            'insert into candidates (fname, lname, roll_no, classes, password, created_on) values ( ?, ?, ?, ?, ?, ?)',
            [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]], {
            })
            .then(results => {
                console.log(results);
                sendResponse.sendResponseData("Data inserted successfully", {
                    fName: "Pankaj",
                    lName: "saw"
                }, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 400;
                err.message = "error in inserting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }

}


exports.registerAdmin = (req, res, next) => {
    const fields = [req.body.fName, req.body.lName, req.body.email, req.body.mobile, req.body.password, moment().format('YYYY-MM-DD HH:MM:ss')];
    let valid = validation.adminRegisterValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        bcrypt.hash(fields[4], 10).then(function (hash) {
            return db.execute(
                'insert into admin (fname, lname, email, mobile, password, created_on) values ( ?, ?, ?, ?, ?, ?)',
                [fields[0], fields[1], fields[2], fields[3], hash, fields[5]], {
                });
        }).then(results => {
            sendResponse.sendResponseData("Admin Registration successfull", {
                fName: fields[0],
                email: fields[2],
                mobile: fields[3]
            }, res);
        }).catch(err => {
            err.statusCode = 400;
            err.message = "error in inserting data";
            err.data = err.sqlMessage;
            next(err);
        });
    }
}


