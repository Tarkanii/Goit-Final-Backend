const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const joi = require('joi');
const { email } = require('../assets/validation.json');

const emailRegExp = new RegExp(email);

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    match: emailRegExp
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: null
  }
}, { timestamps: true, versionKey: false });

userSchema.methods.setPassword = function (password) { 
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePasswords = function (password) {
  return bcrypt.compareSync(password, this.password);
}

const joiSchema = joi.object({
  email: joi.string().pattern(emailRegExp).required(),
  password: joi.string().required()
});

const User = model('user', userSchema);

module.exports = {
  User,
  joiSchema
}