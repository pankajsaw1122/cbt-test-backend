const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const commonFunc = require('../common/common_func');

exports.addQuesCateg = (req, res, next) => {
    const fields = [req.body.examId, req.body.totalQues, req.body.categName, req.body.totalMarks, moment().format('YYYY-MM-DD HH:MM:ss')]
    let valid = validation.quesCategValidate(fields);

    if (valid.error !== null) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        // console.log("In else block");
        // console.log(fields);
        return commonFunc.checkTotalMarks(req.body.examId).then(results => {
            // console.log('inside check total marks');
            // console.group(results[0].length);
            if (results[0].length !== 0) {
                // console.log(results[0][0].examtotalMarks);
                let totalCateg = req.body.totalMarks;
                results[0].forEach(element => {
                    // console.log('************* print element **************');
                    // console.log(element);

                    totalCateg = totalCateg + element.total_marks;
                    // console.log(element.total_marks);
                });
                if (totalCateg > results[0][0].examtotalMarks) {
                    const error = new Error("Exam Total marks error");
                    error.statusCode = 400;
                    error.data = 'Marks cant be greater then exam total marks';
                    throw error;
                }
            }
            return db.execute(
                    'insert into ques_categ (exam_id, total_ques, categ_name, total_marks, created_on) values ( ?, ?, ?, ?, ?)',
                    [fields[0], fields[1], fields[2], fields[3], fields[4]])
                .then(results => {
                    // console.log(results);
                    sendResponse.sendResponseData("Data inserted successfully", results, res);
                }).catch(err => {
                    console.log(err)
                    err.statusCode = 400;
                    err.message = "error in inserting data";
                    err.data = err.sqlMessage;
                    next(err);
                });
        }).catch(err => {
            console.log(err)
            err.statusCode = 400;
            err.message = "Can't add this category because of exam total marks limit";
            err.data = err.sqlMessage;
            next(err);
        });

    }

}

exports.getCategData = (req, res, next) => {
    if (!req.userId) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        console.log('my params = ' + req.query.id);
        if (!req.query.id) {
            return db.execute(
                    'select ques_categ.id, exam.id as exam_id, exam.exam_name, ques_categ.categ_name, ques_categ.total_ques, ques_categ.total_marks from ques_categ LEFT JOIN exam ON ques_categ.exam_id = exam.id where admin_id = ? ORDER BY ques_categ.id DESC',
                    [req.userId])
                .then(results => {
                    results = results[0];
                    sendResponse.sendResponseData("Category data found successfully", results, res);
                }).catch(err => {
                    console.log(err)
                    err.statusCode = 500;
                    err.message = "error in fetching data";
                    err.data = err.sqlMessage;
                    next(err);
                });
        } else {
            return db.execute(
                    'select ques_categ.id, exam.id as exam_id, exam.exam_name, ques_categ.categ_name, ques_categ.total_ques, ques_categ.total_marks from ques_categ LEFT JOIN exam ON ques_categ.exam_id = exam.id where admin_id = ? AND ques_categ.id = ? OR ques_categ.exam_id = ?',
                    [req.userId, req.query.id, req.query.id])
                .then(results => {
                    console.log('inside categ id **************************');
                    console.log(results);

                    results = results[0];
                    sendResponse.sendResponseData("Category Data found successfully", results, res);
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

exports.updateQuesCateg = (req, res, next) => {

    const fields = [req.body.examId, req.body.totalQues, req.body.categName, req.body.totalMarks, moment().format('YYYY-MM-DD HH:MM:ss'), req.body.editId]
    let valid = validation.quesCategValidate(fields);

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
                'update ques_categ SET exam_id=?, total_ques=?, categ_name=?, total_marks=?, updated_on=? where id=?',
                [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]])
            .then(results => {
                console.log(results);
                sendResponse.sendResponseData("Data updated successfully", results, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 400;
                err.message = "error in updating data";
                err.data = err.sqlMessage;
                next(err);
            });
    }

}

exports.deleteQuesCateg = (req, res, next) => {
    console.log('Inside delete category');
    if (!req.userId && !req.query.id) {
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = error;
        throw error;
    } else {
        console.log('my params = ' + req.query.id);

        return db.execute(
                'delete from ques_categ where id = ?',
                [req.query.id])
            .then(results => {
                results = results[0];
                console.log(results);
                sendResponse.sendResponseData("catrgory delete successfull", results, res);
            }).catch(err => {
                console.log(err)
                err.statusCode = 500;
                err.message = "error in deleting data";
                err.data = err.sqlMessage;
                next(err);
            });
    }
}