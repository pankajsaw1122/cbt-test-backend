const Joi = require('joi');

const candidateRegisterSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    rollNo: Joi.string().required(),
    classes: Joi.string().required()
});

const adminRegisterSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    mobile: Joi.string().regex(/^[0-9]{10}$/).required(),
    pswd: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/).required()
});

const authValidSchema = Joi.object().keys({
    userId: Joi.string().required(),
    pswd: Joi.string().min(3).required()
});

const examValidSchema = Joi.object().keys({
    adminId: Joi.number().required(),
    examName: Joi.string().required(),
    examDate: Joi.date().iso().required(),
    examTime: Joi.string().required(),
    examMinute: Joi.number().required(),
    totalMarks: Joi.number().required()

});

const quesCategValidateSchema = Joi.object().keys({
    examId: Joi.number().required(),
    toatlQues: Joi.number().required(),
    categName: Joi.string().required(),
    totalMarks: Joi.number().required(),
});

const addQuesValidateSchema = Joi.object().keys({
    examId: Joi.number().required(),
    quesCategId: Joi.number().required(),
    quesText: Joi.string().required(),
    mark: Joi.number().required(),
    negMark: Joi.number().required()
});

const addChoiceValidateSchema = Joi.object().keys({
    quesId: Joi.number().required(),
    choiceTypeId: Joi.number().required(),
    choiceText: Joi.string().required()
});

const addAnsValidateSchema = Joi.object().keys({
    candidateId: Joi.number().required(),
    quesId: Joi.number().required(),
    choiceId: Joi.any().required()
});

// Return result.
exports.candidateRegisterValidate = (data) => {
    return Joi.validate({ firstName: data[0], rollNo: data[2], classes: data[3] }, candidateRegisterSchema);
}

exports.adminRegisterValidate = (data) => {
    return Joi.validate({ firstName: data[0], lastName: data[1], email: data[2], mobile: data[3], pswd: data[4] }, adminRegisterSchema);
}

exports.authValidate = (data) => {
    return Joi.validate({ userId: data[0], pswd: data[1] }, authValidSchema);
}

exports.examValidate = (data) => {
    return Joi.validate({ adminId: data[0], examName: data[1], examDate: data[3], examTime: data[4], examMinute: data[5], totalMarks: data[6] }, examValidSchema);
}

exports.quesCategValidate = (data) => {
    return Joi.validate({ examId: data[0], toatlQues: data[1], categName: data[2], totalMarks: data[3]}, quesCategValidateSchema);
}

exports.addQuesValidate = (data) => {
    return Joi.validate({ examId: data[0], quesCategId: data[1], quesText: data[2], mark: data[3], negMark: data[4]}, addQuesValidateSchema);
}

exports.addChoiceValidate = (data) => {
    return Joi.validate({ quesId: data[0], choiceTypeId: data[1], choiceText: data[2]}, addChoiceValidateSchema);
}

exports.addAnsValidate = (data) => {
    return Joi.validate({ candidateId: data[0], quesId: data[1], choiceId: data[2]}, addAnsValidateSchema);
}