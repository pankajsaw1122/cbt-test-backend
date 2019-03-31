const sendResponse = require('../common/sendresponse');
const db = require("../config/db");

exports.checkTotalMarks = (id) => {
     return db.execute(
            'select exam.total_marks as examtotalMarks, ques_categ.total_marks from ques_categ LEFT JOIN exam ON ques_categ.exam_id = exam.id where ques_categ.exam_id=?',
            [id]);
}