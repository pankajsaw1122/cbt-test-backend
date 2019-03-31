
exports.sendResponseData = (messageData, datas, res) => {
    res.status(200).json({
        status: 200,
        message: messageData,
        data: datas
    });
}

exports.ErrorResponse = (messageData, datas, next) => {
    const error = new Error(messageData);
        error.statusCode = 400;
        error.data = {};
        next(error);
    // res.status(401).json({
    //     status: 401,
    //     message: messageData,
    //     data: datas
    // });
}