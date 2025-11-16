const validator = require("validator")

const validateSignUpData = (req) =>{
    const {firstName, lastName , emailId , password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is no valid")
    } 
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }

}

const validateEditProfileData = (req) =>{
    const editableFields  = [
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


module.exports = {validateSignUpData , validateEditProfileData};