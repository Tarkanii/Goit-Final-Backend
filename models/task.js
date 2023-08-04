const { Schema, model } = require('mongoose');
const joi = require('joi');

const spentHoursDayRegExp = new RegExp(/^\d{4}-\d{2}-\d{2}$/);

const taskSchema = Schema({
  name: {
    type: String,
    required: true
  },
  scheduledHours: {
    type: Number,
    required: true
  },
  totalHours: {
    type: Number,
    default: 0
  },
  spentHoursDay: [{
    date: {
      type: String,
      match: spentHoursDayRegExp
    },
    hours: {
      type: Number
    }
  }],
  sprint: {
    type: Schema.Types.ObjectId,
    ref: 'project'
  }
}, { timestamps: true, versionKey: false })

const joiSchema = joi.object({
  name: joi.string().required(),
  scheduledHours: joi.number().required(),
  sprint: joi.string().required()
})

const joiUpdateSpentHoursSchema = joi.object({
  date: joi.string().pattern(spentHoursDayRegExp).required(),
  hours: joi.number().required()
})

const Task = model('task', taskSchema);

module.exports = {
  Task,
  joiSchema,
  joiUpdateSpentHoursSchema
}