const Joi = require('joi');

const candidateRegisterSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    rollNo: Joi.string().required(),
    classes: Joi.string().required()
});

const adminRegisterSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({
        minDomainAtoms: 2
    }).required(),
    mobile: Joi.string().regex(/^[0-9]{10}$/).required(),
    pswd: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/).required()
});

const authValidSchema = Joi.object().keys({
    userId: Joi.string().required(),
    pswd: Joi.string().min(3).required()
});

authCandtValidSchema = Joi.object().keys({
    userId: Joi.string().required(),
    pswd: Joi.string().min(3).required()
});

const examValidSchema = Joi.object().keys({
    adminId: Joi.number().required(),
    examName: Joi.string().required(),
    totalQues: Joi.number().required(),
    examMinute: Joi.number().required(),
    totalMarks: Joi.number().required()

});

const quesCategValidateSchema = Joi.object().keys({
    examId: Joi.number().required(),
    toatlQues: Joi.number().required(),
    categName: Joi.string().required(),
    totalMarks: Joi.number().required(),
});

const quesValidateSchema = Joi.object().keys({
    examId: Joi.number().required(),
    categId: Joi.number().required(),
    choiceType: Joi.number().required(),
    quesText: Joi.string().required(),
    quesImage: Joi.string().allow(''),
    marks: Joi.number().required(),
    negMark: Joi.number().required(),
    choice1: Joi.string().required(),
    choice1Image: Joi.string().allow(''),
    choice2: Joi.string().required(),
    choice2Image: Joi.string().allow(''),
    choice3: Joi.string().required(),
    choice3Image: Joi.string().allow(''),
    choice4: Joi.string().required(),
    choice4Image: Joi.string().allow(''),
    choiceA: Joi.boolean().required(),
    choiceB: Joi.boolean().required(),
    choiceC: Joi.boolean().required(),
    choiceD: Joi.boolean().required()
});

const quesUpdateValidateSchema = Joi.object().keys({
    editId: Joi.number().required(),
    examId: Joi.number().required(),
    categId: Joi.number().required(),
    choiceType: Joi.number().required(),
    quesText: Joi.string().required(),
    quesImage: Joi.string().allow(''),
    marks: Joi.number().required(),
    negMark: Joi.number().required(),
    optionId1: Joi.number().required(),
    optionId2: Joi.number().required(),
    optionId3: Joi.number().required(),
    optionId4: Joi.number().required(),
    choice1: Joi.string().required(),
    choice1Image: Joi.string().allow(''),
    choice2: Joi.string().required(),
    choice2Image: Joi.string().allow(''),
    choice3: Joi.string().required(),
    choice3Image: Joi.string().allow(''),
    choice4: Joi.string().required(),
    choice4Image: Joi.string().allow(''),
    choiceA: Joi.boolean().required(),
    choiceB: Joi.boolean().required(),
    choiceC: Joi.boolean().required(),
    choiceD: Joi.boolean().required()
});

const addChoiceValidateSchema = Joi.object().keys({
    quesId: Joi.number().required(),
    choiceTypeId: Joi.number().required(),
    choiceText: Joi.string().required()
});

const addAnsValidateSchema = Joi.object().keys({
    userId: Joi.number().required(),
    exam_id: Joi.number().required(),
    categ_id: Joi.number().required(),
    quesId: Joi.number().required(),
});

const candidateValidateSchema = Joi.object().keys({
    userId: Joi.number().required(),
    fname: Joi.string().min(3).required(),
    lname: Joi.string().required(),
    roll_no: Joi.string().required(),
    classes: Joi.string().required(),
    email: Joi.string().email({
        minDomainAtoms: 2
    }).required(),
    mobile_no: Joi.string().regex(/^[0-9]{10}$/).required(),
    password: Joi.number().min(4).required()
});

const allowLoginValidateSchema = Joi.object().keys({
    userId: Joi.number().required(),
    exam_id: Joi.number().required(),
    classes: Joi.string().required(),
    setMasterPassword: Joi.string().required(),
});

const allowstartExamValidateSchema = Joi.object().keys({
    userId: Joi.number().required(),
    exam_id: Joi.number().required(),
    classes: Joi.string().required()
});


const resultSchema = Joi.object().keys({
    userId: Joi.number().required(),
    examId: Joi.number().required(),
    totalAnswerCount: Joi.number().required(),
    positiveMark: Joi.number().required(),
    positiveCount: Joi.number().required(),
    negMark: Joi.number().required(),
    negCount: Joi.number().required(),
    finalExamMark: Joi.number().required()
});

// Return result.
exports.candidateRegisterValidate = (data) => {
    return Joi.validate({
        firstName: data[0],
        rollNo: data[2],
        classes: data[3]
    }, candidateRegisterSchema);
}

exports.adminRegisterValidate = (data) => {
    return Joi.validate({
        firstName: data[0],
        lastName: data[1],
        email: data[2],
        mobile: data[3],
        pswd: data[4]
    }, adminRegisterSchema);
}

exports.authValidate = (data) => {
    return Joi.validate({
        userId: data[0],
        pswd: data[1]
    }, authValidSchema);
}

exports.authCandtValidate = (data) => {
    return Joi.validate({
        userId: data[0],
        pswd: data[1]
    }, authCandtValidSchema);
}

exports.examValidate = (data) => {
    return Joi.validate({
        adminId: data[0],
        examName: data[1],
        examMinute: data[2],
        totalQues: data[3],
        totalMarks: data[4]
    }, examValidSchema);
}


exports.quesCategValidate = (data) => {
    return Joi.validate({
        examId: data[0],
        toatlQues: data[1],
        categName: data[2],
        totalMarks: data[3]
    }, quesCategValidateSchema);
}

exports.quesValidate = (data) => {
    return Joi.validate({
            examId: data[0],
            categId: data[1],
            choiceType: data[2],
            quesText: data[3],
            quesImage: data[4],
            marks: data[5],
            negMark: data[6],
            choice1: data[7],
            choice1Image: data[8],
            choice2: data[9],
            choice2Image: data[10],
            choice3: data[11],
            choice3Image: data[12],
            choice4: data[13],
            choice4Image: data[14],
            choiceA: data[15],
            choiceB: data[16],
            choiceC: data[17],
            choiceD: data[18]
        },
        quesValidateSchema);
}

exports.quesUpdateValidate = (data) => {
    return Joi.validate({
            editId: data[0],
            examId: data[1],
            categId: data[2],
            choiceType: data[3],
            quesText: data[4],
            quesImage: data[5],
            marks: data[6],
            negMark: data[7],
            optionId1: data[8],
            optionId2: data[9],
            optionId3: data[10],
            optionId4: data[11],
            choice1: data[12],
            choice1Image: data[13],
            choice2: data[14],
            choice2Image: data[15],
            choice3: data[16],
            choice3Image: data[17],
            choice4: data[18],
            choice4Image: data[19],
            choiceA: data[20],
            choiceB: data[21],
            choiceC: data[22],
            choiceD: data[23]
        },
        quesUpdateValidateSchema);
}

exports.addChoiceValidate = (data) => {
    return Joi.validate({
        quesId: data[0],
        choiceTypeId: data[1],
        choiceText: data[2]
    }, addChoiceValidateSchema);
}

exports.ansValidate = (data) => {
    return Joi.validate({
        userId: data[0],
        exam_id: data[1],
        categ_id: data[2],
        quesId: data[3],
    }, addAnsValidateSchema);
}

exports.candidateValidate = (data) => {
    return Joi.validate({
        userId: data[0],
        fname: data[1],
        lname: data[2],
        roll_no: data[3],
        classes: data[4],
        email: data[5],
        mobile_no: data[6],
        password: data[7]
    }, candidateValidateSchema);
}

exports.allowLoginValidate = (data) => {
    return Joi.validate({
        userId: data[0],
        exam_id: data[1],
        classes: data[2],
        setMasterPassword: data[3],
    }, allowLoginValidateSchema);
}

exports.allowStartExamValidate = (data) => {
    return Joi.validate({
        userId: data[0],
        exam_id: data[1],
        classes: data[2]
    }, allowstartExamValidateSchema);
}

exports.resultValidate = (data) => {
    return Joi.validate({
        userId: data[0],
        examId: data[1],
        totalAnswerCount: data[2],
        positiveCount: data[3],
        positiveMark: data[4],
        negCount: data[5],
        negMark: data[6],
        finalExamMark: data[7]
    }, resultSchema);
}

