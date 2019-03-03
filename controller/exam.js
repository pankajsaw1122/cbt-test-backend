const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const bcrypt = require('bcrypt');

exports.addExam = (req, res, next) => {

    const fields = [
        req.userId,
        req.body.examName,
        req.body.classes,
        moment(req.body.examDate).format('YYYY-MM-DD'),
        req.body.examTime,
        req.body.totalMinute,
        req.body.totalMarks,
        moment().format('YYYY-MM-DD HH:MM:ss')
    ]
    console.log('print fields');
    console.log(fields);
    let valid = validation.examValidate(fields);
    if (valid.error !== null) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        console.log("In else block");
        return db.execute(
                'insert into exam (admin_id, exam_name, classes, exam_date, exam_time, exam_minute, total_marks, created_on) values (?, ?, ?, ?, ?, ?, ?, ?)',
                [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5], fields[6], fields[7]])
            .then(results => {
                console.log(results);
                sendResponse.sendResponseData("Exam Created successful", results, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 500;
                err.message = "error in inserting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.updateExam = (req, res, next) => {

    const fields = [
        req.userId,
        req.body.examName,
        req.body.classes,
        moment(req.body.examDate).format('YYYY-MM-DD'),
        req.body.examTime,
        req.body.totalMinute,
        req.body.totalMarks,
        moment().format('YYYY-MM-DD HH:MM:ss'),
        req.body.editId
    ]
    console.log('print fields');
    console.log(fields);
    let valid = validation.examValidate(fields);
    if (valid.error !== null) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        console.log("In else block");
        return db.execute(
                'update exam set exam_name=?, classes=?, exam_date=?, exam_time=?, exam_minute=?, total_marks=?, updated_on=? where id = ?',
                [fields[1], fields[2], fields[3], fields[4], fields[5], fields[6], fields[7], fields[8]])
            .then(results => {
                console.log(results);
                sendResponse.sendResponseData("Exam Data Update successful", results, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 500;
                err.message = "error in updating data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.getExamData = (req, res, next) => {
    if (!req.userId) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        console.log('my params = ' + req.query.id);
        if (!req.query.id) {
            return db.execute(
                    'select * from exam where admin_id = ? ORDER BY id DESC',
                    [req.userId])
                .then(results => {
                    results = results[0];
                    console.log(results);
                    sendResponse.sendResponseData("Exam data found successfully", results, res);
                }).catch(err => {
                    console.log(err)
                    err.statusCode = 500;
                    err.message = "error in fetching data";
                    err.data = err.sqlMessage;
                    next(err);
                });
        } else {
            return db.execute(
                    'select * from exam where admin_id = ? AND id = ?',
                    [req.userId, req.query.id])
                .then(results => {
                    results = results[0];
                    console.log(results);
                    sendResponse.sendResponseData("Exam data found successfully", results, res);
                }).catch(err => {
                    console.log(err)
                    err.statusCode = 500;
                    err.message = "error in fetching data";
                    err.data = err.sqlMessage;
                    next(err);
                });
        }
    }
}

exports.deleteExam = (req, res, next) => {
    if (!req.userId && !req.query.id) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        console.log('my params = ' + req.query.id);

        return db.execute(
                'delete from exam where admin_id = ? AND id = ?',
                [req.userId, req.query.id])
            .then(results => {
                results = results[0];
                console.log(results);
                sendResponse.sendResponseData("Exam delete successfull", results, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 500;
                err.message = "error in deleting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}