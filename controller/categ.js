const moment = require("moment");
const validation = require("../common/validation");
const sendResponse = require("../common/sendresponse");
const db = require("../config/db");
const commonFunc = require("../common/common_func");

exports.addQuesCateg = (req, res, next) => {
  const fields = [
    req.body.examId,
    req.body.totalQues,
    req.body.categName,
    req.body.totalMarks,
    moment().format("YYYY-MM-DD HH:mm:ss")
  ];
  let totalQues = 0;
  let totalMarks = 0;

  let valid = validation.quesCategValidate(fields);

  if (valid.error !== null) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = valid.error;
    throw error;
    // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
  } else {
    return commonFunc
      .checkTotalMarks(req.body.examId)
      .then(results => {
        console.log('Inside category add function ***************');
        console.log(results[0][0]);
        if (results[0][0].total_ques !== undefined || results[0][0].total_marks !== undefined) {
          totalQues = fields[1];
          totalMarks = fields[3];
          results[0].forEach(element => {
            totalQues = totalQues + element.total_ques;
            totalMarks = totalMarks + element.total_marks;
          });
        } else {
          totalQues = fields[1];
          totalMarks = fields[3];
        }
        if (totalQues > results[0][0].examTotalQues || totalMarks > results[0][0].examtotalMarks) {
          const error = new Error("Exam Total marks error");
          error.statusCode = 400;
          error.message =
            "Category Total question or total mark can't be higher then exam total question or marks";
          throw error;
        }

        return db.execute(
          "insert into ques_categ (exam_id, total_ques, categ_name, total_marks, created_on) values ( ?, ?, ?, ?, ?)",
          [fields[0], fields[1], fields[2], fields[3], fields[4]]
        );
      })
      .then(results => {
        // console.log(results);
        sendResponse.sendResponseData(
          "Data inserted successfully",
          results,
          res
        );
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 400;
        err.message = err.message;
        err.data = err.sqlMessage;
        next(err);
      });
  }
};

exports.getCategData = (req, res, next) => {
  if (!req.userId) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    if (!req.query.id) {
      return db
        .execute(
          "select ques_categ.id, exam.id as exam_id, exam.exam_name, ques_categ.categ_name, ques_categ.total_ques, ques_categ.total_marks from ques_categ LEFT JOIN exam ON ques_categ.exam_id = exam.id where admin_id = ? ORDER BY ques_categ.id DESC",
          [req.userId]
        )
        .then(results => {
          results = results[0];
          sendResponse.sendResponseData(
            "Category data found successfully",
            results,
            res
          );
        })
        .catch(err => {
          console.log(err);
          err.statusCode = 500;
          err.message = "error in fetching data";
          err.data = err.sqlMessage;
          next(err);
        });
    } else {
      return db
        .execute(
          "select ques_categ.id, exam.id as exam_id, exam.exam_name, ques_categ.categ_name, ques_categ.total_ques, ques_categ.total_marks from ques_categ LEFT JOIN exam ON ques_categ.exam_id = exam.id where admin_id = ? AND ques_categ.id = ?",
          [req.userId, req.query.id]
        )
        .then(results => {
          results = results[0];
          sendResponse.sendResponseData(
            "Category Data found successfully",
            results,
            res
          );
        })
        .catch(err => {
          console.log(err);
          err.statusCode = 500;
          err.message = "error in fetching data";
          err.data = err.sqlMessage;
          next(err);
        });
    }
  }
};

exports.getCategList = (req, res, next) => {
  if (!req.userId && !req.query.id) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    return db
      .execute(
        "select ques_categ.id, exam.id as exam_id, exam.exam_name, ques_categ.categ_name, ques_categ.total_ques, ques_categ.total_marks from ques_categ LEFT JOIN exam ON ques_categ.exam_id = exam.id where admin_id = ? AND ques_categ.exam_id = ?",
        [req.userId, req.query.id]
      )
      .then(results => {
        results = results[0];
        sendResponse.sendResponseData(
          "Category Data found successfully",
          results,
          res
        );
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 500;
        err.message = "error in fetching data";
        err.data = err.sqlMessage;
        next(err);
      });
  }
};

exports.updateQuesCateg = (req, res, next) => {
  console.log('Inside update request ************');

  const fields = [
    req.body.examId,
    req.body.totalQues,
    req.body.categName,
    req.body.totalMarks,
    moment().format("YYYY-MM-DD HH:MM:ss"),
    req.body.editId
  ];
  console.log(fields);

  let valid = validation.quesCategValidate(fields);

  if (valid.error !== null) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = valid.error;
    throw error;
    // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
  } else {
    return commonFunc
      .checkTotalMarks(req.body.examId)
      .then(results => {
        console.log('Exam categ details');
        console.log(results[0]);
        if (results[0].length !== 0) {
          let totalQues = fields[1];
          let totalMarks = fields[3];
          results[0].forEach(element => {
            if (element.categ_name === fields[2]) {
              element.total_marks = 0;
              element.total_ques = 0;
            }
            totalMarks = totalMarks + element.total_marks;
            totalQues = totalQues + element.total_ques;

          });

          if (totalMarks > results[0][0].examtotalMarks || totalQues > results[0][0].examTotalQues) {
            const error = new Error("Exam Total marks error");
            error.statusCode = 400;
            error.message = "Marks or total question cant be greater then exam total marks or total question";
            throw error;
          }
        }
        return db.execute(
          "update ques_categ SET exam_id=?, total_ques=?, categ_name=?, total_marks=?, updated_on=? where id=?",
          [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]]
        );
      })
      .then(results => {
        sendResponse.sendResponseData(
          "Data updated successfully",
          results,
          res
        );
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 400;
        err.message = err.message;
        err.data = err.sqlMessage;
        next(err);
      });
  }
};

exports.deleteQuesCateg = (req, res, next) => {
  if (!req.userId && !req.query.id) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    return db
      .execute("delete from ques_categ where id = ?", [req.query.id])
      .then(results => {
        return db.execute(
          "delete from questions, choice, answer_key USING questions INNER JOIN choice INNER JOIN answer_key where questions.id = choice.ques_id AND choice.ques_id = answer_key.ques_id AND questions.ques_categ_id = ?",
          [req.query.id]
        );
      })
      .then(results => {
        results = results[0];
        sendResponse.sendResponseData(
          "catrgory delete successfull",
          results,
          res
        );
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 500;
        err.message = "error in deleting data";
        err.data = err.sqlMessage;
        next(err);
      });
  }
};
