const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSignUpSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 50,
  },
  gender: {
    type: String,
    required: true,
    validate(value) {
      if (!["Male", "Female", "Other"].includes(value)) {
        throw new Error("Select proper Gender");
      }
    },
  },
  place: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Enter correct email ID");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

userSignUpSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "PHOTO@admin$890");
  return token
}

userSignUpSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;

}


const UserSignUp = mongoose.model("UserSignUp", userSignUpSchema);

module.exports = UserSignUp;
