const { Sprint, Project, Task } = require('../../models');

const fieldFilters = '_id name startDate endDate duration';

const getSprintById = async (req, res) => {
  const { id } = req.params;
  const sprint = await Sprint.findById(id, fieldFilters);
  if (!sprint) {
    res.status(404).json({
      message: 'Sprint not found'
    });
    return;
  }

  res.json({
    sprint
  })
}

const addSprint = async (req, res) => {
  const { name, project } = req.body;

  let sprint = await Sprint.findOne({ project, name });
  if (sprint) {
    res.status(409).json({
      message: 'Already exist'
    });
    return;
  }

  sprint = await Sprint.create({ ...req.body});
  await Project.findByIdAndUpdate(project, { $push: { sprints: sprint._id } });

  res.json({
    sprint: {
      _id: sprint._id,
      duraion: sprint.duration,
      ...req.body
    }
  })
}

const updateSprintName = async (req, res) => {
  const { id } = req.params;
  const { name, project } = req.body;

  let sprint = await Sprint.findOne({ project, name });
  if (sprint) {
    res.status(409).json({
      message: 'Already exist'
    });
    return;
  }

  sprint = await Sprint.findByIdAndUpdate(id, { name }, { new: true, select: fieldFilters });
  if (!sprint) {
    res.status(404).json({
      message: 'Sprint not found'
    });
    return;
  }

  res.json({
    sprint
  })
}

const deleteSprintById = async (req, res) => {
  const { id } = req.params;
  const sprint = await Sprint.findByIdAndDelete(id);
  if (!sprint) {
    res.status(404).json({
      message: 'Sprint not found'
    });
    return;
  }

  sprint.tasks.forEach(async (id) => {
    await Task.findByIdAndDelete(id);
  })

  const { project: projectId } = sprint;
  const project = await Project.findByIdAndUpdate(projectId, { $pull: { sprints: id } });
  if (!project) {
    res.status(404).json({
      message: 'Project not found'
    });
    return;
  }

  res.status(204).json()
}

module.exports = {
  getSprintById,
  addSprint,
  updateSprintName,
  deleteSprintById
}