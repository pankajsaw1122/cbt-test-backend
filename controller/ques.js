const moment = require("moment");
const validation = require("../common/validation");
const sendResponse = require("../common/sendresponse");
const db = require("../config/db");
const commFunc = require("../common/common_func");

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
    req.body.quesImage,
    req.body.marks,
    req.body.negMark,
    req.body.choice1,
    req.body.choice1Image,
    req.body.choice2,
    req.body.choice2Image,
    req.body.choice3,
    req.body.choice3Image,
    req.body.choice4,
    req.body.choice4Image,
    req.body.choiceA,
    req.body.choiceB,
    req.body.choiceC,
    req.body.choiceD,
    moment().format("YYYY-MM-DD HH:MM:ss")
  ];
  
  console.log(fields); 
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
    commFunc
      .checkQuestionCount(fields[0], fields[1])
      .then(result => {
        console.log("print result of questions count");
        console.log(result[0]);
        let totalMarks = fields[5];
        if (result[0].length !== 0) {
          for (let mark of result[0]) {
            totalMarks = totalMarks + mark.marks;
          }
          const error = new Error("Error while adding question");
          error.statusCode = 400;
          if (totalMarks > result[0][0].total_marks) {
            error.message = "Marks is exceeding the limit";
            throw error;
          } else if (result[0][0].total_ques == result[0].length) {
            error.message = "total questions already reached it's limit";
            throw error;
          }
          if (result[0][0].total_ques == result[0].length + 1 && totalMarks < result[0][0].total_marks) {
            error.message = "Marks on questions is not properly set. please check all question marks";
            throw error;
          }
          if (result[0].length + 1 < result[0][0].total_ques && totalMarks === result[0][0].total_marks) {
            error.message = "You have reached marks limit before total questions limit";
            throw error;
          }
        }
        // console.log(result[0].length +  ' === 0 ' + ' || ' + ' ( ' + result[0][0].total_ques + ' > ' + result[0].length + ' && ' + totalMarks + ' <= ' + result[0][0].total_marks + ' ) ');
        if (result[0].length === 0 || (result[0][0].total_ques > result[0].length && totalMarks <= result[0][0].total_marks)) {
          return db
            .execute(
              "insert into questions (exam_id, ques_categ_id, ques_type_id, ques_text, ques_image, marks, neg_mark, created_on) values ( ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                fields[0],
                fields[1],
                fields[2],
                fields[3],
                fields[4],
                fields[5],
                fields[6],
                fields[19]
              ]
            )
            .then(results => {
              quesId = results[0].insertId;
              let param = [];
              for (let i = 0, x = 7, y = 8; i < 4; i++) {
                param[i] = [results[0].insertId, fields[x], fields[y], fields[19]];
                x = x+2;
                y = y+2;
              }
              return db.query(
                "insert into choice (ques_id, choice_text, choice_image, created_on) values ?",
                [param]
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
                  fields[19]
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
        } else {
        }
      })
      .catch(err => {
        console.log(err);
        err.statusCode = 400;
        err.message =
          err.sqlMessage === undefined ? err.message : "Some error occured";
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
    req.body.quesImage,
    req.body.marks,
    req.body.negMark,
    req.body.optionId1,
    req.body.optionId2,
    req.body.optionId3,
    req.body.optionId4,
    req.body.choice1,
    req.body.choice1Image,
    req.body.choice2,
    req.body.choice2Image,
    req.body.choice3,
    req.body.choice3Image,
    req.body.choice4,
    req.body.choice4Image,
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
    commFunc
      .checkQuestionCount(fields[1], fields[2])
      .then(result => {
        console.log("print result of questions count");
        console.log(result[0]);
        let totalMarks = fields[5];
        for (let mark of result[0]) {
          console.log(
            "condition  mark.id === " + mark.id + "fields[0] = " + fields[0]
          );

          if (parseInt(mark.id) === parseInt(fields[0])) {
            console.log("condition true");
            mark.marks = 0;
          }
          totalMarks = totalMarks + mark.marks;
        }

        console.log("result[0].total_ques = " + result[0][0].total_ques);
        console.log("result[0].length = " + result[0].length);
        console.log("totalMarks = " + totalMarks);
        console.log("result[0].total_marks = " + result[0][0].total_marks);
        if (
          result[0][0].total_ques > result[0].length ||
          totalMarks <= result[0][0].total_marks
        ) {
          return db
            .execute(
              "update questions SET exam_id = ?, ques_categ_id = ?, ques_type_id = ?, ques_text = ?, ques_image = ?, marks = ?, neg_mark = ?, updated_on = ? where id = ?",
              [
                fields[1],
                fields[2],
                fields[3],
                fields[4],
                fields[5],
                fields[6],
                fields[7],
                fields[24],
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

              return db.execute(
                "update choice set choice_text = ?, choice_image = ? where id = ?",
                [fields[12], fields[13], fields[8]]
              );
            })
            .then(result => {
              return db.execute(
                "update choice set choice_text = ?, choice_image = ? where id = ?",
                [fields[14], fields[15], fields[9]]
              );
            })
            .then(results => {
              return db.execute(
                "update choice set choice_text = ?, choice_image = ? where id = ?",
                [fields[16], fields[17], fields[10]]
              );
            })
            .then(results => {
              return db.execute(
                "update choice set choice_text = ?, choice_image = ? where id = ?",
                [fields[18], fields[19], fields[11]]
              );
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
                  fields[24],
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
        } else {
          const error = new Error("questions length reached");
          error.statusCode = 400;
          error.message = "questions length exceded";
          throw error;
        }
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
          "select questions.id, exam.exam_name, ques_categ.categ_name, ques_categ.categ_name, ques_type.type, questions.marks, questions.neg_mark, questions.ques_text, questions.ques_image from questions LEFT JOIN ques_categ ON questions.ques_categ_id = ques_categ.id LEFT JOIN ques_type ON questions.ques_type_id = ques_type.id LEFT JOIN exam ON questions.exam_id = exam.id where exam.admin_id = ? ORDER BY id DESC",
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
          "select questions.exam_id, ques_categ_id, ques_type_id, ques_text, ques_image, marks, neg_mark, choice.id as option_id, choice.choice_text, choice.choice_image, answer_key.choice_id from questions LEFT JOIN choice ON questions.id = choice.ques_id LEFT JOIN answer_key ON questions.id = answer_key.ques_id LEFT JOIN exam ON questions.exam_id = exam.id where exam.admin_id = ? AND questions.id = ?",
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
              ques_image: results[0].ques_image,
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
              choice_image: [
                results[0].choice_image,
                results[1].choice_image,
                results[2].choice_image,
                results[3].choice_image
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
  console.log("Inside delete category");
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
        "delete from questions, choice, answer_key USING questions INNER JOIN choice INNER JOIN answer_key where questions.id = choice.ques_id AND choice.ques_id = answer_key.ques_id AND questions.id = ?",
        [req.query.id]
      )
      .then(results => {
        results = results[0];
        console.log(results);
        sendResponse.sendResponseData(
          "Question delete successfull",
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
