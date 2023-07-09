const { Sprint, Project } = require('../../models');

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
  const sprint = await Sprint.create({ ...req.body});
  await Project.findByIdAndUpdate(req.body.project, { $push: { sprints: sprint._id } });

  res.json({
    sprint: {
      _id: sprint._id,
      ...req.body
    }
  })
}

const updateSprintName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sprint = await Sprint.findByIdAndUpdate(id, { name }, { new: true, select: fieldFilters });
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