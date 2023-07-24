const { Task, Sprint } = require('../../models');

const fieldFilters = '_id name scheduledHours totalHours spentHoursDay';

const addTask = async (req, res) => {
  const task = await Task.create({ ...req.body });
  await Sprint.findByIdAndUpdate(req.body.sprint, { $push: { tasks: task._id } });
  const { name, scheduledHours, _id, totalHours, spentHoursDay } = task;
  
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
  const task = await Task.findByIdAndUpdate(id, { name: req.body.name }, { new: true, select: fieldFilters });
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
  const newTask = await Task.findByIdAndUpdate(id, { spentHoursDay: newArr }, { new: true, select: fieldFilters});

  res.json({
    task: newTask
  });
}

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  await Sprint.findByIdAndUpdate(task.sprint, { $pull: { tasks: id } });

  res.status(204).json();
}

module.exports = {
  addTask,
  deleteTask,
  updateTaskName,
  updateSpentDay
}