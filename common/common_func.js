const sendResponse = require('../common/sendresponse');
const db = require("../config/db");

exports.checkTotalMarks = (id) => {
     let query = '';
     return db.execute(
          'select id from ques_categ where ques_categ.exam_id = ?',
          [id]).then(result => {
               console.log('inside common func');

               console.log(result[0]);
               if(result[0].length === 0) {
                    query = 'select exam.total_marks as examtotalMarks, exam.total_ques as examTotalQues from exam where exam.id = ?';
               } else {
                    query = 'select exam.total_marks as examtotalMarks, exam.total_ques as examTotalQues, ques_categ.total_marks, ques_categ.total_ques, ques_categ.categ_name from ques_categ LEFT JOIN exam ON ques_categ.exam_id = exam.id where ques_categ.exam_id = ?';
               }
          }).then(result => {
               return db.execute(
                    query, [id]);
          }).catch(err => {
               console.log(err);
          })
     
}

exports.checkQuestionCount = (examid, categId) => {
     console.log('exam id = ' + examid + ' categ id = ' + categId);
     return db.execute(
          'select ques_categ.total_marks, ques_categ.total_ques, questions.id, questions.marks from questions LEFT JOIN ques_categ ON questions.ques_categ_id = ques_categ.id where questions.exam_id = ? AND questions.ques_categ_id = ?',
          [examid, categId]);
}