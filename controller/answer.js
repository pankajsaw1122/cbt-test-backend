const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const bcrypt = require('bcrypt');


exports.addAnswer = (req, res, next) => {
    const fields = [req.body.candidateId, req.body.quesId, JSON.stringify(req.body.choiceId), moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.addAnsValidate(fields);

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
            'insert into answer (candt_id, ques_id, choice_id, created_on) values ( ?, ?, ?, ?)',
            [fields[0], fields[1], fields[2], fields[3]], {
            })
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

