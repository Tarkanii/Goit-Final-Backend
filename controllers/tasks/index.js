const { Task, Sprint } = require('../../models');

const fieldFilters = '_id name scheduledHours totalHours spentHoursDay';

const addTask = async (req, res) => {
  const { name, sprint } = req.body;

  let task = await Task.findOne({ sprint, name });
  if (task) {
    res.status(409).json({
      message: 'Already exist'
    });
    return;
  }

  task = await Task.create({ ...req.body });
  const { duration } = await Sprint.findByIdAndUpdate(req.body.sprint, { $push: { tasks: task._id } });
  await Sprint.findByIdAndUpdate(req.body.sprint, { duration: duration + task.scheduledHours });
  const { scheduledHours, _id, totalHours, spentHoursDay } = task;
  
  res.json({
    task: {
      _id,
      name,
      scheduledHours,
      totalHours,
      spentHoursDay
    }
  });
}

const updateTaskName = async (req, res) => {
  const { id } = req.params;
  const { name, sprint } = req.body;
  let task = await Task.findOne({ sprint, name });
  if (task) {
    res.status(409).json({
      message: 'Already exist'
    });
    return;
  }

  task = await Task.findByIdAndUpdate(id, { name }, { new: true, select: fieldFilters });
  if (!task) {
    res.status(404).json({
      message: 'Task not found'
    });
    return;
  }

  res.json({
    task
  });
}

const updateSpentDay = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id, fieldFilters);
  if (!task) {
    res.status(404).json({
      message: 'Task not found'
    });
    return;
  }

  const { date, hours } = req.body;
  const newArr = task.spentHoursDay.filter((value) => value.date !== date);
  newArr.push({ date, hours });
  const totalHours = newArr.reduce((accum, spentDay) => accum += spentDay.hours, 0);
  const newTask = await Task.findByIdAndUpdate(id, { spentHoursDay: newArr, totalHours }, { new: true, select: fieldFilters});

  res.json({
    task: newTask
  });
}

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  const sprint = await Sprint.findByIdAndUpdate(task.sprint, { $pull: { tasks: id } });
  const duration = sprint.duration - task.scheduledHours;
  await Sprint.findByIdAndUpdate(task.sprint, { duration });

  res.status(204).json();
}

module.exports = {
  addTask,
  deleteTask,
  updateTaskName,
  updateSpentDay
}