const moment = require("moment");
const validation = require("../common/validation");
const sendResponse = require("../common/sendresponse");
const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.getQuesType = (req, res, next) => {
  if (!req.userId) {
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = error;
    throw error;
  } else {
    return db
      .execute("select * from ques_type")
      .then(results => {
        console.log(results);
        sendResponse.sendResponseData(
          "Question type found successfully",
          results[0],
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

exports.addQues = (req, res, next) => {
  const fields = [
    req.body.examId,
    req.body.categId,
    req.body.choiceType,
    req.body.quesText,
    req.body.marks,
    req.body.negMark,
    req.body.choice1,
    req.body.choice2,
    req.body.choice3,
    req.body.choice4,
    req.body.choiceA,
    req.body.choiceB,
    req.body.choiceC,
    req.body.choiceD,
    moment().format("YYYY-MM-DD HH:MM:ss")
  ];
  let quesId = "";
  let choiceArray = [];
  let valid = validation.quesValidate(fields);

  if (valid.error !== null) {
    console.log(valid.error);
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = valid.error;
    throw error;
  } else {
    return db
      .execute(
        "insert into questions (exam_id, ques_categ_id, ques_type_id, ques_text, marks, neg_mark, created_on) values ( ?, ?, ?, ?, ?, ?, ?)",
        [
          fields[0],
          fields[1],
          fields[2],
          fields[3],
          fields[4],
          fields[5],
          fields[14]
        ]
      )
      .then(results => {
        quesId = results[0].insertId;
        // var pars = [
        //   [results[0].insertId, fields[6], fields[14]],
        //   [results[0].insertId, fields[7], fields[14]],
        //   [results[0].insertId, fields[8], fields[14]],
        //   [results[0].insertId, fields[9], fields[14]]
        // ];

        return db.execute(
          "insert into choice (ques_id, choice_text, created_on) values ('" +
            results[0].insertId +
            "', '" +
            fields[6] +
            "', '" +
            fields[14] +
            "'), ('" +
            results[0].insertId +
            "', '" +
            fields[7] +
            "', '" +
            fields[14] +
            "'), ('" +
            results[0].insertId +
            "', '" +
            fields[8] +
            "', '" +
            fields[14] +
            "'), ('" +
            results[0].insertId +
            "', '" +
            fields[9] +
            "', '" +
            fields[14] +
            "')"
        );
      })
      .then(results => {
        if (fields[10] === true) {
          choiceArray.push(results[0].insertId);
        }
        if (fields[11] === true) {
          choiceArray.push(results[0].insertId + 1);
        }
        if (fields[12] === true) {
          choiceArray.push(results[0].insertId + 2);
        }
        if (fields[13] === true) {
          choiceArray.push(results[0].insertId + 3);
        }
        return db.execute(
          "insert into answer_key (exam_id, categ_id, ques_id, choice_id, created_on) values ( ?, ?, ?, ?, ?)",
          [
            fields[0],
            fields[1],
            quesId,
            JSON.stringify(choiceArray),
            fields[14]
          ]
        );
      })
      .then(results => {
        sendResponse.sendResponseData(
          "Data submitted successfully",
          results,
          res
        );
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 400;
        err.message = "error in inserting data";
        err.data = err.sqlMessage;
        next(err);
      });
  }
};

exports.updateQues = (req, res, next) => {
  const fields = [
    req.body.editId,
    req.body.examId,
    req.body.categId,
    req.body.choiceType,
    req.body.quesText,
    req.body.marks,
    req.body.negMark,
    req.body.optionId1,
    req.body.optionId2,
    req.body.optionId3,
    req.body.optionId4,
    req.body.choice1,
    req.body.choice2,
    req.body.choice3,
    req.body.choice4,
    req.body.choiceA,
    req.body.choiceB,
    req.body.choiceC,
    req.body.choiceD,
    moment().format("YYYY-MM-DD HH:MM:ss")
  ];
  let quesId = "";
  let choiceArray = [];
  let valid = validation.quesUpdateValidate(fields);

  if (valid.error !== null) {
    console.log(valid.error);
    const error = new Error(
      "Invalid data or some data is missing, pls try again"
    );
    error.statusCode = 400;
    error.data = valid.error;
    throw error;
  } else {
    return db
      .execute(
        "update questions SET exam_id = ?, ques_categ_id = ?, ques_type_id = ?, ques_text = ?, marks = ?, neg_mark = ?, updated_on = ? where id = ?",
        [
          fields[1],
          fields[2],
          fields[3],
          fields[4],
          fields[5],
          fields[6],
          fields[19],
          fields[0]
        ]
      )
      .then(results => {
        console.log(results);
        quesId = results[0].insertId;
        // var pars = [
        //   [results[0].insertId, fields[6], fields[14]],
        //   [results[0].insertId, fields[7], fields[14]],
        //   [results[0].insertId, fields[8], fields[14]],
        //   [results[0].insertId, fields[9], fields[14]]
        // ];

        return db.execute("update choice set choice_text = ? where id = ?", [
          fields[11],
          fields[7]
        ]);
      })
      .then(result => {
        return db.execute("update choice set choice_text = ? where id = ?", [
          fields[12],
          fields[8]
        ]);
      })
      .then(results => {
        return db.execute("update choice set choice_text = ? where id = ?", [
          fields[13],
          fields[9]
        ]);
      })
      .then(results => {
        return db.execute("update choice set choice_text = ? where id = ?", [
          fields[14],
          fields[10]
        ]);
      })
      .then(results => {
        console.log(results);
        if (fields[15] === true) {
          choiceArray.push(fields[7]);
        }
        if (fields[16] === true) {
          choiceArray.push(fields[8]);
        }
        if (fields[17] === true) {
          choiceArray.push(fields[9]);
        }
        if (fields[18] === true) {
          choiceArray.push(fields[10]);
        }
        return db.execute(
          "update answer_key set exam_id = ?, categ_id = ?, choice_id = ?, updated_on = ? where  ques_id = ?",
          [
            fields[1],
            fields[2],
            JSON.stringify(choiceArray),
            fields[19],
            fields[0]
          ]
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
        err.message = "error in updating data";
        err.data = err.sqlMessage;
        next(err);
      });
  }
};

exports.getQuesData = (req, res, next) => {
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
        .execute(
          "select questions.id, exam.exam_name, ques_categ.categ_name, ques_categ.categ_name, ques_type.type, questions.marks, questions.neg_mark, questions.ques_text from questions LEFT JOIN ques_categ ON questions.ques_categ_id = ques_categ.id LEFT JOIN ques_type ON questions.ques_type_id = ques_type.id LEFT JOIN exam ON questions.exam_id = exam.id where exam.admin_id = ? ORDER BY id DESC",
          [req.userId]
        )
        .then(results => {
          results = results[0];
          // console.log(results);
          sendResponse.sendResponseData(
            "Question data found successfully",
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
          "select questions.exam_id, ques_categ_id, ques_type_id, ques_text, marks, neg_mark, choice.id as option_id, choice.choice_text, answer_key.choice_id from questions LEFT JOIN choice ON questions.id = choice.ques_id LEFT JOIN answer_key ON questions.id = answer_key.ques_id LEFT JOIN exam ON questions.exam_id = exam.id where exam.admin_id = ? AND questions.id = ?",
          [req.userId, req.query.id]
        )
        .then(results => {
          results = results[0];
          let answer_key = [false, false, false, false];
          for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < results[0].choice_id.length; j++) {
              if (results[i].option_id === results[0].choice_id[j]) {
                answer_key[i] = true;
              }
            }
          }

          let respData = [
            {
              exam_id: results[0].exam_id,
              ques_categ_id: results[0].ques_categ_id,
              ques_type_id: results[0].ques_type_id,
              ques_text: results[0].ques_text,
              marks: results[0].marks,
              neg_mark: results[0].neg_mark,
              option_id: [
                results[0].option_id,
                results[1].option_id,
                results[2].option_id,
                results[3].option_id
              ],
              choice_text: [
                results[0].choice_text,
                results[1].choice_text,
                results[2].choice_text,
                results[3].choice_text
              ],
              choice_id: answer_key
            }
          ];
          sendResponse.sendResponseData(
            "Question data found successfully",
            respData,
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

exports.deleteQues = (req, res, next) => {
  console.log('Inside delete category');
  if (!req.userId && !req.query.id) {
      const error = new Error("Invalid data or some data is missing, pls try again");
      error.statusCode = 400;
      error.data = error;
      throw error;
  } else {
      console.log('my params = ' + req.query.id);

      return db.execute(
              'delete from questions, choice, answer_key USING questions INNER JOIN choice INNER JOIN answer_key where questions.id = choice.ques_id AND choice.ques_id = answer_key.ques_id AND questions.id = ?',
              [req.query.id])
          .then(results => {
              results = results[0];
              console.log(results);
              sendResponse.sendResponseData("Question delete successfull", results, res);
          }).catch(err => {
              console.log(err)
              err.statusCode = 500;
              err.message = "error in deleting data";
              err.data = err.sqlMessage;
              next(err);
          });
  }
}
