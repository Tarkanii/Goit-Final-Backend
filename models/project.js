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
  },
  sprints: [{
    type: Schema.Types.ObjectId,
    ref: 'sprint'
  }]
}, { timestamps: true, versionKey: false });

const joiSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().allow('')
})

const Project = model('project', projectSchema);

module.exports = {
  Project,
  joiSchema
}