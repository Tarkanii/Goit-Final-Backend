const { Schema, model } = require('mongoose');
const joi = require('joi');

const sprintSchema = Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project'
  },
  tasks: [{
    type: Schema.ObjectId,
    ref: 'task'
  }]
}, { timestamps: true, versionKey: false })

const joiSchema = joi.object({
  name: joi.string().required(),
  startDate: joi.string().required(),
  endDate: joi.string().required(),
  project: joi.string().required()
})

const Sprint = model('sprint', sprintSchema);

module.exports = {
  Sprint,
  joiSchema
}