const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const bcrypt = require('bcrypt');


exports.addQuesCateg = (req, res, next) => {
    const fields = [req.body.examId, req.body.totalQues, req.body.categName, req.body.totalMarks, moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.addQuesCategValidate(fields);

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
                'select exam.total_marks, ques_categ.total_marks as categMarks from ques_categ LEFT JOIN exam ON ques_categ.exam_id=exam.id where ques_categ.exam_id=?',
                [fields[0]])
            .then(results => {
                console.log("print selct reult of add categ");
                console.log(results);
                // sendResponse.sendResponseData("Data inserted successfully", results, res);
                return db.execute(
                        'insert into ques_categ (exam_id, total_ques, categ_name, total_marks, created_on) values ( ?, ?, ?, ?, ?)',
                        [fields[0], fields[1], fields[2], fields[3], fields[4]], {})
                    .then(results => {
                        console.log(results);
                        sendResponse.sendResponseData("Data inserted successfully", results, res);
                    }).catch(err => {
                        console.log(err)
                        err.statusCode = 400;
                        err.message = "error in inserting data";
                        err.data = err.sqlMessage;
                        next(err);
                    });
            })

    }

}


exports.addQues = (req, res, next) => {
    const fields = [req.body.examId, req.body.quesCategId, req.body.quesText, req.body.mark, req.body.negMark, moment().format('YYYY-MM-DD HH:MM:ss')]
    console.log("print ques data");

    console.log(fields);
    let valid = validation.addQuesValidate(fields);

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
                'insert into questions (exam_id, ques_categ_id, ques_text, marks, neg_mark, created_on) values ( ?, ?, ?, ?, ?, ?)',
                [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]], {})
            .then(results => {
                console.log(results);
                sendResponse.sendResponseData("Data inserted successfully", results, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 400;
                err.message = "error in inserting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}

exports.addChoice = (req, res, next) => {
    const fields = [req.body.quesId, req.body.choiceTypeId, req.body.choiceText, moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.addChoiceValidate(fields);

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
                'insert into choice (ques_id, choice_type_id, choice_text, created_on) values ( ?, ?, ?, ?)',
                [fields[0], fields[1], fields[2], fields[3]], {})
            .then(results => {
                console.log(results);
                sendResponse.sendResponseData("Data inserted successfully", results, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 400;
                err.message = "error in inserting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }

}