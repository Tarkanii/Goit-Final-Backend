const { Project } = require('../../models');

const fieldFilters = '_id name description';

const getAllProjects = async (req, res) => {
  const { _id } = req.user;
  const projects = await Project.find({ owner: _id }, fieldFilters);
  res.json({
    projects
  });
}

const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId, fieldFilters);
  if (!project) {
    res.status(404).json({
      message: 'Project not found'
    });
    return;
  }

  res.json({
    project
  });
}

const addProject = async (req, res) => {
  const { _id } = req.user;
  const { name, description = '' } = req.body;
  const project = await Project.create({ name, description, owner: _id });
  res.json({
    project: {
      name,
      description,
      id: project._id
    }
  });
}

const updateProjectById = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findByIdAndUpdate(projectId, req.body, { new: true, select: fieldFilters });
  if (!project) {
    res.status(404).json({
      message: 'Project not found'
    });
    return;
  }

  res.json({
    project
  });
}

const deleteProjectById = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    res.status(404).json({
      message: 'Project not found'
    });
    return;
  }

  res.status(204).json();
}

module.exports = {
  getAllProjects,
  addProject,
  getProjectById,
  updateProjectById,
  deleteProjectById
}