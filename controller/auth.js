const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.authAdmin = (req, res, next) => {
    const fields = [req.body.userId, req.body.password]
    let valid = validation.authValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        db.query(
            'Select id, fname, mobile, password from admin where email = ?',
            [fields[0]], {})
            .then(results => {
                if (results[0].length === 0) {
                    const err = new Error("Data not found");
                    err.statusCode = 401;
                    err.message = "No user found";
                    err.data = [];
                    next(err);
                } else {
                    return bcrypt.compare(fields[1], results[0][0].password, function (err, resp) {
                        if (resp == true) {
                            const token = jwt.sign({
                                userId: results[0][0].id
                            },
                                'weareworkingoncbttestapplication', {
                                    expiresIn: '6h'
                                }
                            );
                            sendResponse.sendResponseData("User login successfull", {
                                adminId: results[0][0].id,
                                token: token
                            }, res);
                        } else {
                            sendResponse.ErrorResponse("please check password and try again", {}, next);
                        }
                    });
                }
            }).catch(err => {
                err.statusCode = 500;
                err.message = "error while login please try again";
                err.data = err.sqlMessage;
                next(err);
            });
    }

}

exports.changePassword = (req, res, next) => {
    const fields = [req.body.email, req.body.password, moment().format('YYYY-MM-DD HH:MM:ss')];
        bcrypt.hash(fields[1], 4).then(function (hash) {
            return db.execute(
                'update admin set password = ?, updated_on = ? where email = ?',
                [hash, fields[2], fields[0]], {
                });
        }).then(results => {
            sendResponse.sendResponseData("Password reset successfull", {
                password: results,
                email: fields[2],
            }, res);
        }).catch(err => {
            err.statusCode = 400;
            err.message = "error in updating data";
            err.data = err.sqlMessage;
            next(err);
        });
    }


exports.authCandt = (req, res, next) => {
    const fields = [req.body.rollNo, req.body.password.toString()]
    let valid = validation.authCandtValidate(fields);
    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        db.execute(
            'Select candidates.id, candidates.fname, candidates.lname, candidates.roll_no, candidates.classes, candidates.email, candidates.mobile_no, candidates.allow_login, candidates.allow_exam, candidates.password, exam.id as examId, exam.exam_name from candidates LEFT JOIN exam ON candidates.allowed_exam_id = exam.id where candidates.roll_no = ?',
            [fields[0]])
            .then(results => {
                if (results[0].length === 0) {
                    const err = new Error("Data not found");
                    err.statusCode = 401;
                    err.message = "No user found";
                    err.data = [];
                    next(err);
                } else {
                    if (results[0][0].password == fields[1]) {
                        const token = jwt.sign({
                            userId: results[0][0].id
                        },
                            'weareworkingoncbttestapplication', {
                                expiresIn: '6h'
                            }
                        );
                        if (results[0][0].allow_login === 1) {
                            console.log(results[0][0]);
                            sendResponse.sendResponseData("User login successfull", {
                                userData: results[0][0],
                                token: token
                            }, res);
                        } else {
                            const err = new Error("Login not allowd by admin");
                            err.statusCode = 401;
                            err.message = "Login not allowed by admin";
                            err.data = [];
                            next(err);
                            // sendResponse.ErrorResponse("Login Not allowed", {}, next);
                        }
                    } else {
                        sendResponse.ErrorResponse("please check password and try again", {}, next);
                    }
                }
            }).catch(err => {
                err.statusCode = 500;
                console.log(err);
                err.message = "error while login please try again";
                err.data = err.sqlMessage;
                next(err);
            });
    }

}