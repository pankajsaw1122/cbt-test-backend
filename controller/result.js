const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const commonFunc = require('../common/common_func');

exports.getMarksData = (req, res, next) => {
    if (!req.userId || !req.query.examId) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        return db.execute(
                'select answer.categ_id, answer.ques_id, answer.choice_id as answered_id, answer_key.choice_id as correct_ans_id, questions.marks, questions.neg_mark from answer LEFT JOIN questions ON answer.ques_id = questions.id LEFT JOIN answer_key ON answer.ques_id = answer_key.ques_id where answer.candt_id = ? AND answer.exam_id = ?',
                [req.userId, req.query.examId])
            .then(results => {
                sendResponse.sendResponseData("Data fetched successfully", results[0], res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 400;
                err.message = "error in inserting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.saveResult = (req, res, next) => {
    const fields = [req.userId, parseInt(req.body.examId), req.body.totalAnswerCount, req.body.positiveCount, req.body.positiveMark, req.body.negCount, req.body.negMark, req.body.finalExamMark, moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.resultValidate(fields);
    console.log(fields);
    if (valid.error !== null) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        return db.execute(
            'select id from result where candt_id = ? AND exam_id = ?',
            [fields[0], fields[1]]).then(results => {
            console.log(results);
            if (results[0].length === 0) {
                return db.execute(
                    'insert into result (candt_id, exam_id, total_ans_count, positive_count, positive_mark, neg_count, neg_mark, total_marks, created_on) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5], fields[6], fields[7], fields[8]]).then(result => {
                    sendResponse.sendResponseData("Data fetched successfully", results[0], res);
                }).catch(err => {
                    console.log(err)
                    err.statusCode = 400;
                    err.message = "error in inserting data";
                    err.data = err.sqlMessage;
                    next(err);
                });
            } else {
                const error = new Error("Result is already saved");
                error.statusCode = 400;
                error.data = valid.error;
                throw error;
            }
        }).catch(err => {
            console.log(err)
            err.statusCode = 400;
            err.message = "error in fetching data";
            err.data = err.sqlMessage;
            next(err);
        });
    }
}

exports.getResultData = (req, res, next) => {
    console.log(req.query.examId);
    console.log(req.query.classes);


    if (!req.userId || !req.query.examId || !req.query.classes) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        let query = '';
        let param = [];
        if(req.query.classes === '0' || req.query.classes === 0) {
            query = 'select candidates.fname, candidates.lname, candidates.roll_no, candidates.classes, exam.exam_name, result.total_ans_count, result.positive_count, result.positive_mark, result.neg_count, result.neg_mark, result.total_marks from result LEFT JOIN candidates ON result.candt_id = candidates.id LEFT JOIN exam ON result.exam_id = exam.id where result.exam_id = ? ORDER BY result.total_marks desc';
            param = [req.query.examId];
        } else {
            query = 'select candidates.fname, candidates.lname, candidates.roll_no, candidates.classes, exam.exam_name, result.total_ans_count, result.positive_count, result.positive_mark, result.neg_count, result.neg_mark, result.total_marks from result LEFT JOIN candidates ON result.candt_id = candidates.id LEFT JOIN exam ON result.exam_id = exam.id where result.exam_id = ? AND candidates.classes = ? ORDER BY result.total_marks desc';
            param = [req.query.examId, req.query.classes];
        }
        return db.execute(
                query, param)
            .then(results => {
                sendResponse.sendResponseData("Data fetched successfully", results[0], res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 400;
                err.message = "error in fetching data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}
