const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const commonFunc = require('../common/common_func');

exports.getExamStatus = (req, res, next) => {
    if (!req.userId && !req.query.id) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        return db.execute(
            'select login_allowed, exam_started, exam_stopped from exam where id = ?',
            [req.query.id])
            .then(results => {
                sendResponse.sendResponseData("Exam data found successfully", results[0], res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 500;
                err.message = "error in fetching data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.getExamInfo = (req, res, next) => {
    if (!req.userId && !req.query.id) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        return db.execute(
            'select exam.exam_name, exam.exam_minute, exam.total_ques, exam.total_marks, exam.login_allowed, exam.exam_started, exam.exam_stopped, ques_categ.total_ques as total_categ_ques, ques_categ.categ_name, ques_categ.total_marks as categ_marks, questions.ques_categ_id, questions.marks from exam LEFT JOIN ques_categ ON exam.id = ques_categ.exam_id LEFT JOIN questions ON ques_categ.id = questions.ques_categ_id where exam.admin_id = ? AND exam.id = ?',
            [req.userId, req.query.id])
            .then(results => {
                results = results[0];
                let resData = {
                    examName: results[0].exam_name,
                    examMinute: results[0].examMinute,
                    totalMarks: results[0].totalMarks,
                    totalQues: results[0].total_ques
                }
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





exports.allowLogin = (req, res, next) => {
    console.log('inside allow login');
    console.log(req.body);
    console.log(req.userId);

    // req.body.setMasterPassword.toString(),
    const fields = [req.userId, req.body.examId, req.body.classes.toString(), moment().format('YYYY-MM-DD hh:mm:ss')]
    let valid = validation.allowLoginValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        let query = 'update candidates SET password = ?, allow_login = ?, allowed_exam_id = ?, updated_on=? where classes = ? AND admin_id = ?';
        let param = [req.body.setMasterPassword, 1, req.body.examId, moment().format('YYYY-MM-DD hh:mm:ss'), req.body.classes.toString(), req.userId];
        if (req.body.classes.toString() !== '0' && (req.body.setMasterPassword === '' || req.body.setMasterPassword === undefined)) {
            query = 'update candidates SET allow_login = ?, allowed_exam_id = ?, updated_on=? where classes = ? AND admin_id = ?';
            param = [1, req.body.examId, moment().format('YYYY-MM-DD hh:mm:ss'), req.body.classes.toString(), req.userId];
        } else if (req.body.classes.toString() === '0' && req.body.setMasterPassword !== '') {
            query = 'update candidates SET password = ?, allow_login = ?, allowed_exam_id = ?, updated_on = ? where admin_id = ?';
            param = [req.body.setMasterPassword, 1, req.body.examId, moment().format('YYYY-MM-DD hh:mm:ss'), req.userId];
        } else if (req.body.classes.toString() === '0' && req.body.setMasterPassword === '') {
            query = 'update candidates SET allow_login = ?, allowed_exam_id = ?, updated_on = ? where admin_id = ?';
            param = [1, req.body.examId, moment().format('YYYY-MM-DD hh:mm:ss'), req.userId];
        }
        console.log(query);
        return db.execute(query, param)
            .then(results => {
                return db.execute('update exam set login_allowed = ?, exam_stopped = ? where id = ?', [1, 0, req.body.examId])
            }).then(data => {
                sendResponse.sendResponseData("Login allowed successfully", data, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 400;
                err.message = "error in updating data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.allowStartExam = (req, res, next) => {

    const fields = [req.userId, req.body.examId, req.body.classes.toString(), moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.allowStartExamValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        let query = 'update candidates SET allow_exam = ?, allowed_exam_id = ?, updated_on=? where classes = ? AND admin_id = ?';
        let param = [1, fields[1], fields[3], fields[2], fields[0]];
        if (fields[2] === '0') {
            query = 'update candidates SET allow_exam = ?, allowed_exam_id = ?, updated_on=? where admin_id = ?';
            param = [1, fields[1], fields[3], fields[0]];
        }
        return db.execute(
            query, param
        ).then(results => {
            return db.execute('update exam set exam_started = ? where id = ?', [1, req.body.examId])
        }).then(results => {
            sendResponse.sendResponseData("Exam Start allowed successfully", results, res);
        }).catch(err => {
            console.log(err)
            err.statusCode = 400;
            err.message = "error in updating data";
            err.data = err.sqlMessage;
            next(err);
        });
    }
}

exports.deleteCandt = (req, res, next) => {
    console.log('Inside delete category');
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
                console.log(err)
                err.statusCode = 500;
                err.message = "error in deleting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.examStats = (req, res, next) => {
    console.log('Inside exams stats');
    if (!req.query.exam_id) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        return db.execute(
            'select candidates.id, fname, lname, roll_no, classes, mobile_no, left_minute, exam.exam_name, exam.id as exam_id, isLoggedIn, isGivingExam, exam_start_time, exam_end_time from candidates LEFT JOIN exam ON candidates.allowed_exam_id =  exam.id where candidates.admin_id = ? AND allowed_exam_id = ?',
            [req.userId, req.query.exam_id])
            .then(results => {
                results = results[0];
                sendResponse.sendResponseData("Candidate delete successfull", results, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 500;
                err.message = "error in deleting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.stopExam = (req, res, next) => {

    console.log('Insde stop exam ****************');
    console.log(req.userId);

    console.log(req.body);

    const fields = [req.userId, req.body.examId, req.body.classes.toString(), moment().format('YYYY-MM-DD hh:mm:ss')]
    let valid = validation.allowStartExamValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        let query = 'update candidates SET allow_login = ?,  allow_exam = ?, allowed_exam_id = ?, isLoggedIn = ?, isGivingExam = ?, exam_start_time = ?, exam_end_time = ?, updated_on = ? where classes = ? AND admin_id = ?';
        let param = [0, 0, 0, 0, 0, null, null, moment().format('YYYY-MM-DD hh:mm:ss'), req.body.classes.toString(), req.userId];
        if (fields[2] === '0') {
            query = 'update candidates SET allow_login = ?, allow_exam = ?, allowed_exam_id = ?, isLoggedIn = ?, isGivingExam = ?, exam_start_time = ?, exam_end_time = ?, updated_on = ? where admin_id = ?';
            param = [0, 0, 0, 0, 0, null, null, moment().format('YYYY-MM-DD hh:mm:ss'), req.userId];
        }

        console.log('Print query');
        console.log(query);

        return db.execute(
            query, param
        ).then(results => {
            return db.execute('update exam set login_allowed = ?, exam_started = ?, exam_stopped = ? where id = ?', [0, 0, 1, req.body.examId])
        }).then(results => {
            sendResponse.sendResponseData("Exam Stoped successfully", results, res);
        }).catch(err => {
            console.log(err)
            err.statusCode = 400;
            err.message = "error in updating data";
            err.data = err.sqlMessage;
            next(err);
        });
    }
}