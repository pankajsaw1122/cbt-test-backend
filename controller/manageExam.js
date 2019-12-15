const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const commonFunc = require('../common/common_func');

exports.getExamInfo = (req, res, next) => {
    if (!req.userId && !req.query.id) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {        
            return db.execute(
                    'select exam.exam_name, exam.exam_minute, exam.total_ques, exam.total_marks, ques_categ.total_ques as total_categ_ques, ques_categ.categ_name, ques_categ.total_marks as categ_marks, questions.ques_categ_id, questions.marks from exam LEFT JOIN ques_categ ON exam.id = ques_categ.exam_id LEFT JOIN questions ON ques_categ.id = questions.ques_categ_id where exam.admin_id = ? AND exam.id = ?',
                    [req.userId, req.query.id])
                .then(results => {
                    results = results[0];
                    let resData = {
                        examName : results[0].exam_name,
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

    const fields = [req.userId, req.body.examId, req.body.classes.toString(), req.body.setMasterPassword.toString(), moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.allowLoginValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        let query = 'update candidates SET password = ?, allow_login = ?, allowed_exam_id = ?, updated_on=? where classes = ? AND admin_id = ?';
        let param = [fields[3], 1, fields[1], fields[4], fields[2], fields[0]];
        if (fields[2] === '0') {
            query = 'update candidates SET password = ?, allow_login = ?, allowed_exam_id = ?, updated_on=? where admin_id = ?';
            param = [fields[3], 1, fields[1], fields[4], fields[0]];
        }
        return db.execute(
                query, param
            )
            .then(results => {
                sendResponse.sendResponseData("Login allowed successfully", results, res);
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
            )
            .then(results => {
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