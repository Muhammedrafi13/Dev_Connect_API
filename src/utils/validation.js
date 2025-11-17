const validator = require("validator")

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || firstName.trim() === '') {
        throw new Error("First name is required.");
    }

    if (!lastName || lastName.trim() === '') {
        throw new Error("Last name is required.");
    }

    if (!emailId || emailId.trim() === '') {
        throw new Error("Email is required.");
    }

    if (!password) {
        throw new Error("Password is required.");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("The provided email address is not valid.");
    }

}

const validateEditProfileData = (req) => {
    const editableFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "emailId",
        "photoUrl",
        "skills",
        "about"
    ]

    const valid = Object.keys(req.body).every(field => editableFields.includes(field))
    return valid;
}


module.exports = { validateSignUpData, validateEditProfileData };