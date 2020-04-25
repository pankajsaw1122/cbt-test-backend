const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
exports.addAnswer = (req, res, next) => {
    const fields = [req.userId, parseInt(req.body.exam_id), req.body.categ_id, req.body.ques_id, JSON.stringify(req.body.choiceId), moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.ansValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
    } else {
        // console.log("In else block");
        // console.log(fields);
        return db.execute('select * from answer where candt_id = ? AND exam_id = ? AND categ_id = ? AND ques_id = ? ',
            [req.userId, parseInt(req.body.exam_id), req.body.categ_id, req.body.ques_id]).then(result => {
                let query = '';
                let data = [];

                if (result[0].length === 0 || result[0].length === undefined) {
                    query = 'insert into answer (candt_id, exam_id, categ_id, ques_id, choice_id, attempted, unanswerd, answered, created_on) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    data = [req.userId, parseInt(req.body.exam_id), req.body.categ_id, req.body.ques_id, JSON.stringify(req.body.choiceId), 0, 0, 1, moment().format('YYYY-MM-DD hh:mm:ss')];
                } else {
                    query = 'update answer set choice_id = ?, attempted, unanswerd = ?, answered = ?, updated_on = ? where candt_id = ? AND ques_id = ?';
                    data = [JSON.stringify(req.body.choiceId), 0, 0, 1, moment().format('YYYY-MM-DD hh:mm:ss'), req.userId, req.body.ques_id];
                }
                return db.execute(query, data);
            }).then(results => {
                sendResponse.sendResponseData("Data saved successfully", results, res);
            }).catch(err => {
                err.statusCode = 400;
                err.message = "error in saving data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.removeAnswer = (req, res, next) => {
    const fields = [req.userId, parseInt(req.body.exam_id), req.body.categ_id, req.body.ques_id]
    // console.log(fields);
    let valid = validation.ansValidate(fields);

    if (valid.error !== null) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        return db.execute('delete from answer where candt_id = ? AND exam_id = ? AND ques_id = ?',
            [fields[0], fields[1], fields[3]]
        ).then(results => {
            sendResponse.sendResponseData("Data saved successfully", results, res);
        }).catch(err => {
            err.statusCode = 400;
            err.message = "error in saving data";
            err.data = err.sqlMessage;
            next(err);
        });
    }
}