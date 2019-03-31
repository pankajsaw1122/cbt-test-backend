const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const bcrypt = require('bcrypt');

exports.addAnswer = (req, res, next) => {
    const fields = [req.userId, parseInt(req.body.exam_id), req.body.categ_id, req.body.ques_id, JSON.stringify(req.body.choiceId), moment().format('YYYY-MM-DD HH:MM:ss')]
    console.log(fields);
    let valid = validation.ansValidate(fields);

    if (valid.error !== null) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        console.log("In else block");
        console.log(fields);
        return db.execute(
            'select * from answer where candt_id = ? AND exam_id = ? AND categ_id = ? AND ques_id = ? ',
            [fields[0], fields[1], fields[2], fields[3]]).then(result => {
            let query = '';
            let data = [];
            console.log('result length ==== *********');
            console.log(result[0].length);

            if (result[0].length === 0 || result[0].length === undefined) {
                query = 'insert into answer (candt_id, exam_id, categ_id, ques_id, choice_id, created_on) values ( ?, ?, ?, ?, ?, ?)';
                data = [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]];
            } else {
                query = 'update answer set choice_id = ?, updated_on = ? where candt_id = ? AND ques_id = ?';
                data = [fields[4], fields[5], fields[0], fields[3]];
            }
            return db.execute(
                query, data);
        }).then(results => {
            console.log(results);
            sendResponse.sendResponseData("Data saved successfully", results, res);
        }).catch(err => {
            console.log(err)
            err.statusCode = 400;
            err.message = "error in saving data";
            err.data = err.sqlMessage;
            next(err);
        });
    }
}

exports.removeAnswer = (req, res, next) => {
    const fields = [req.userId, parseInt(req.body.exam_id), req.body.categ_id, req.body.ques_id]
    console.log(fields);
    let valid = validation.ansValidate(fields);

    if (valid.error !== null) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        console.log("In else block");
        console.log(fields);
        return db.execute('delete from answer where candt_id = ? AND exam_id = ? AND ques_id = ?',
                [fields[0], fields[1], fields[3]]
        ).then(results => {
            console.log(results);
            sendResponse.sendResponseData("Data saved successfully", results, res);
        }).catch(err => {
            console.log(err)
            err.statusCode = 400;
            err.message = "error in saving data";
            err.data = err.sqlMessage;
            next(err);
        });
    }
}