const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const commonFunc = require('../common/common_func');

exports.addCandt = (req, res, next) => {
    const fields = [req.userId, req.body.fname, req.body.lname, req.body.roll_no, req.body.classes, req.body.email, req.body.mobile_no.toString(), Math.floor((Math.random() * 40000000000) + 10000000000), moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.candidateValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        return db.execute(
                'insert into candidates (admin_id, fname, lname, roll_no, classes, email, mobile_no, password, created_on) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5], fields[6], fields[7], fields[8]])
            .then(results => {
                sendResponse.sendResponseData("Data inserted successfully", results, res);
            }).catch(err => {
                err.statusCode = 400;
                err.message = "error in inserting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.getCandtData = (req, res, next) => {
    if (!req.userId) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        if (!req.query.id) {
            return db.execute(
                    'select id, fname, lname, classes, roll_no, email, mobile_no, password from candidates where admin_id = ? ORDER BY candidates.id DESC',
                    [req.userId])
                .then(results => {
                    results = results[0];
                    sendResponse.sendResponseData("Candidates data found successfully", results, res);
                }).catch(err => {
                    err.statusCode = 500;
                    err.message = "error in fetching data";
                    err.data = err.sqlMessage;
                    next(err);
                });
        } else {
            return db.execute(
                    'select fname, lname, classes, roll_no, email, mobile_no, password from candidates where candidates.id = ?',
                    [req.query.id])
                .then(results => {
                    results = results[0];
                    sendResponse.sendResponseData("Candidates Data found successfully", results, res);
                }).catch(err => {
                    err.statusCode = 500;
                    err.message = "error in fetching data";
                    err.data = err.sqlMessage;
                    next(err);
                });
        }
    }
}

exports.setLoggedIn = (req, res, next) => {
    if (!req.userId) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        return db.execute(
                'update candidates set isLoggedIn = ? where id = ?',
                [true, req.query.id])
            .then(results => {
                results = results[0];
                sendResponse.sendResponseData("Candidates Logged In set", results, res);
            }).catch(err => {
                err.statusCode = 500;
                err.message = "error in updating data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.checkStartExam = (req, res, next) => {
    if (!req.userId) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        if (!req.query.id) {
            err.statusCode = 500;
            err.message = "error in fetching data";
            err.data = err.sqlMessage;
            next(err);
        } else {
            return db.execute(
                    'select id, allow_exam from candidates where id = ?',
                    [req.query.id])
                .then(results => {
                    results = results[0];
                    if (results[0].allow_exam === 1) {
                        sendResponse.sendResponseData("Candidate allowed to give exam", results, res);
                    } else {
                        const err = new Error("Exam not started yet");
                        err.statusCode = 500;
                        err.message = "Exam not started yet";
                        err.data = {};
                        next(err);
                    }
                }).catch(err => {
                    err.statusCode = 500;
                    err.message = "Some error occured";
                    err.data = err.sqlMessage;
                    next(err);
                });
        }
    }
}

exports.updateCandt = (req, res, next) => {

    const fields = [req.userId, req.body.fname, req.body.lname, req.body.roll_no, req.body.classes, req.body.email, req.body.mobile_no.toString(), Math.floor((Math.random() * 40000000000) + 10000000000), moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.candidateValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        return db.execute(
                'update candidates SET fname=?, lname=?, roll_no=?, classes=?, email=?, mobile_no=?, password = ?, updated_on=? where admin_id=? AND id = ?',
                [fields[1], fields[2], fields[3], fields[4], fields[5], fields[6], fields[7], fields[8], fields[0], req.body.editId])
            .then(results => {
                sendResponse.sendResponseData("Data updated successfully", results, res);
            }).catch(err => {
                err.statusCode = 400;
                err.message = "error in updating data";
                err.data = err.sqlMessage;
                next(err);
            });
    }

}

exports.deleteCandt = (req, res, next) => {
    if (!req.userId && !req.query.id) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        return db.execute(
                'delete from candidates where id = ?',
                [req.query.id])
            .then(results => {
                results = results[0];
                sendResponse.sendResponseData("Candidate delete successfull", results, res);
            }).catch(err => {
                err.statusCode = 500;
                err.message = "error in deleting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}