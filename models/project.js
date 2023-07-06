const { model, Schema } = require('mongoose');
const joi = require('joi');

const projectSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true, versionKey: false });

const joiSchema = joi.object({
  name: joi.string().required(),
  description: joi.string()
})

const Project = model('project', projectSchema);

module.exports = {
  Project,
  joiSchema
}