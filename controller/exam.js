const moment = require("moment");
const validation = require("../common/validation");
const sendResponse = require("../common/sendresponse");
const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.addExam = (req, res, next) => {
  const fields = [
    req.userId,
    req.body.examName,
    req.body.totalMinute,
    req.body.totalQues,
    req.body.totalMarks,
    moment().format("YYYY-MM-DD HH:MM:ss")
  ];
  console.log("print fields");
  console.log(fields);
  let valid = validation.examValidate(fields);
  if (valid.error !== null) {
    console.log(valid.error);
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = valid.error;
    throw error;
    // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
  } else {
    console.log("In else block");
    return db
      .execute(
        "insert into exam (admin_id, exam_name, exam_minute, total_ques, total_marks, created_on) values (?, ?, ?, ?, ?, ?)",
        [fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]]
      )
      .then(results => {
        console.log(results);
        sendResponse.sendResponseData("Exam Created successful", results, res);
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 500;
        err.message = "error in inserting data";
        err.data = err.sqlMessage;
        next(err);
      });
  }
};

exports.updateExam = (req, res, next) => {
  const fields = [
    req.userId,
    req.body.examName,
    req.body.totalQues,
    req.body.totalMinute,
    req.body.totalMarks,
    moment().format("YYYY-MM-DD HH:MM:ss"),
    req.body.editId
  ];
  console.log("print fields");
  console.log(fields);
  let valid = validation.examValidate(fields);
  if (valid.error !== null) {
    console.log(valid.error);
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = valid.error;
    throw error;
    // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
  } else {
    console.log("In else block");
    return db
      .execute(
        "update exam set exam_name=?, exam_minute=?, total_marks=?, total_ques=?, updated_on=? where id = ?",
        [fields[1], fields[2], fields[3], fields[4], fields[5], fields[6]]
      )
      .then(results => {
        console.log(results);
        sendResponse.sendResponseData(
          "Exam Data Update successful",
          results,
          res
        );
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 500;
        err.message = "error in updating data";
        err.data = err.sqlMessage;
        next(err);
      });
  }
};
exports.fetchQuestionsList = (req, res, next) => {
  if (!req.userId && !req.query.id) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    console.log("my params = " + req.query.id);

    return db
      .execute(
        "select questions.id from questions where exam_id = ? ORDER BY RAND()",
        [req.query.id]
      )
      .then(results => {
        results = results[0];
        console.log(results.length);
        sendResponse.sendResponseData(
          "Exam data found successfully",
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

exports.getExamQuesData = (req, res, next) => {
  if (!req.userId && !req.query.examId && !req.query.quesId) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    console.log("my params = " + req.query.id);

    return db
      .execute(
        "select ques_categ.total_ques as total_categ_ques, ques_categ.categ_name, ques_categ.total_marks as categ_marks, questions.id as ques_id, questions.ques_categ_id, questions.ques_type_id, questions.ques_text, questions.marks, questions.neg_mark, choice.id as choiceId, choice.choice_text, answer.choice_id from exam LEFT JOIN ques_categ ON exam.id = ques_categ.exam_id LEFT JOIN questions ON ques_categ.id = questions.ques_categ_id LEFT JOIN choice ON choice.ques_id = questions.id LEFT JOIN answer ON answer.ques_id = questions.id where exam.id = ? AND questions.id = ?",
        [req.query.examId, req.query.quesId]
      )
      .then(results => {
        results = results[0];
        let ques = [];
        for (let i = 0, x = 0; i < results.length; i = i + 4, x++) {
          ques.push(results[i]);
          ques[x].choiceData = [];
          for (let j = i; j < i + 4; j++) {
            ques[x].choiceData.push({
              choiceId: results[j].choiceId,
              choiceText: results[j].choice_text
            });
          }
        }
        sendResponse.sendResponseData(
          "Exam data found successfully",
          ques,
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

exports.getExamData = (req, res, next) => {
  if (!req.userId) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    console.log("my params = " + req.query.id);
    if (!req.query.id) {
      return db
        .execute("select * from exam where admin_id = ? ORDER BY id DESC", [
          req.userId
        ])
        .then(results => {
          results = results[0];
          // console.log(results);
          sendResponse.sendResponseData(
            "Exam data found successfully",
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
        .execute("select * from exam where id = ?", [req.query.id])
        .then(results => {
          results = results[0];
          // console.log(results);
          sendResponse.sendResponseData(
            "Exam data found successfully",
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

exports.deleteExam = (req, res, next) => {
  if (!req.userId && !req.query.id) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    console.log("my params = " + req.query.id);

    return db
      .execute("delete from exam where admin_id = ? AND id = ?", [
        req.userId,
        req.query.id
      ])
      .then(results => {
        results = results[0];
        console.log(results);
        sendResponse.sendResponseData("Exam delete successfull", results, res);
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

exports.finishExam = (req, res, next) => {
  if (!req.userId && !req.query.id) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    console.log("my params = " + req.query.id);
    return db.execute("update candidates set allow_login = ?, allow_Exam = ?, isLoggedIn = ?, isGivingExam = ?, finished_exam = ?, updated_on = ? where id = ? AND allowed_exam_id = ?", 
      [0, 0, 0, 0, 1, moment().format("YYYY-MM-DD HH:MM:ss"), req.userId, req.query.id])
      .then(results => {
        console.log(results);
        sendResponse.sendResponseData("Exam Submitted successfully", results, res);
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 500;
        err.message = "error in finshing exam";
        err.data = err.sqlMessage;
        next(err);
      });
  }
}



