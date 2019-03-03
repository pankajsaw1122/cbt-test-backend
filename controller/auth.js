const moment = require('moment');
const validation = require('../common/validation');
const sendResponse = require('../common/sendresponse');
const db = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.authAdmin = (req, res, next) => {
    const fields = [req.body.userId, req.body.password]
    let valid = validation.authValidate(fields);

    if (valid.error !== null) {
        console.log(valid.error)
        const error = new Error("Invalid data or some data is missing, pls try again");
        error.statusCode = 400;
        error.data = valid.error;
        throw error;
        // sendResponse.sendResponseData(400, "failed", "Invalid data or some data is missing, pls try again", {}, res);
    } else {
        console.log("In else block");
        db.execute(
            'Select id, fname, mobile, password from admin where email = ?',
            [fields[0]], {
            })
            .then(results => {
                console.log(results[0]);
                if (results[0].length === 0) {
                    const err = new Error("Data not found");
                    err.statusCode = 401;
                    err.message = "No user found";
                    err.data = [];
                    next(err);
                } else {
                    console.log(results[0][0].password);
                    return bcrypt.compare(fields[1], results[0][0].password, function (err, resp) {
                        if (resp == true) {
                            const token = jwt.sign(
                                {
                                    userId: results[0][0].id
                                },
                                'weareworkingoncbttestapplication',
                                { expiresIn: '6h' }
                            );
                            sendResponse.sendResponseData("User login successfull", {
                                adminId: results[0][0].id,
                                token: token
                            }, res);
                        } else {
                            sendResponse.ErrorResponse("please check password and try again", {
                            }, next);
                            // sendResponse.sendResponseData("please check password and try again", {
                            // }, res);
                        }
                    });
                }
            }).catch(err => {
                console.log(err)
                err.statusCode = 500;
                err.message = "error while login please try again";
                err.data = err.sqlMessage;
                next(err);
            });
    }

}