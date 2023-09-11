const { Project, Sprint, Task, User } = require('../../models');

const fieldFilters = '_id owner name description participants';
const sprintFieldFilters = '_id name startDate endDate duration tasks';
const taskFieldFilters = '_id name scheduledHours totalHours spentHoursDay';

const getAllProjects = async (req, res) => {
  const { _id } = req.user;
  const projects = await Project.find({ participants: _id }, fieldFilters)
    .populate({
      path: 'sprints',
      select: sprintFieldFilters,
      populate: {
        path: 'tasks',
        select: taskFieldFilters
      }
    })
    .populate('participants', 'email')

  res.json({
    projects: getProjectsForUser(projects, _id)
  });
}

const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  const { _id } = req.user;
  const project = await Project.findById(projectId, fieldFilters)
    .populate('sprints', sprintFieldFilters)
    .populate('participants', 'email');

  if (!project) {
    res.status(404).json({
      message: 'Project not found'
    });
    return;
  }

  res.json({
    project: getProjectsForUser(project, _id)
  });
}

const addProject = async (req, res) => {
  const { _id } = req.user;
  const { name, description = '' } = req.body;
  let project = await Project.findOne({ owner: _id, name });
  if (project) {
    res.status(409).json({
      message: 'Already exist'
    });
    return;
  }

  project = await Project.create({ name, description, owner: _id, participants: [_id] });
  await project.populate('participants', 'email');

  res.json({
    project: getProjectsForUser(project, _id)
  });
}

const updateProjectById = async (req, res) => {
  const { projectId } = req.params;
  const { _id } = req.user;
  
  if (req.body?.name) {
    const project = await Project.findOne({ owner: _id, name: req.body?.name });
    if (project) {
      res.status(409).json({
        message: 'Already exist'
      });
      return;
    }
  }
  
  const project = await Project.findByIdAndUpdate(projectId, req.body, { new: true, select: fieldFilters })
    .populate('sprints', sprintFieldFilters)
    .populate('participants', 'email');

  if (!project) {
    res.status(404).json({
      message: 'Project not found'
    });
    return;
  }

  res.json({
    project: getProjectsForUser(project, _id)
  });
}

const deleteProjectById = async (req, res) => {
  const { projectId } = req.params;
  await Project.findByIdAndDelete(projectId);

  let tasksId = [];
  for (const sprint of req.project.sprints) {
    const { tasks } = await Sprint.findByIdAndDelete(sprint._id);
    tasksId = [...tasksId, ...tasks];
  }
  
  for (const id of tasksId) {
    await Task.findByIdAndDelete(id);
  }

  res.status(204).json();
}

const updateParticipants = async (req, res) => {
  const { projectId } = req.params;
  const { email, action } = req.body;
  let { project } = req;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({
      message: 'User not found'
    });
    return;
  }

  const isParticipantOwner = String(project.owner) === String(user._id);  
  if (action === 'delete' && isParticipantOwner) {
    res.status(403).json({
      message: 'User delete not allowed'
    });
    return;
  }

  if (action === 'delete') {
    project = await Project.findByIdAndUpdate(projectId, { $pull: { participants: user._id } }, { new: true }).populate('participants', 'email');
  } else {
    project = await Project.findByIdAndUpdate(projectId, { $addToSet: { participants: user._id } }, { new: true }).populate('participants', 'email');
  }

  res.json({
    project: getProjectsForUser(project, user._id)
  })

}

function getProjectsForUser(object, userId) {
  if (!Array.isArray(object)) {
    const { _id, owner, sprints, description, name, participants } = object;
    return {
      _id, 
      name,
      description,
      sprints,
      owner: String(owner) === String(userId),
      participants: getParticipantsForUser(participants)
    };
  }

  return object.reduce((accum, { _id, owner, sprints, description, name, participants }) => {
    accum.push({
      _id, 
      name,
      description,
      sprints,
      owner: String(owner) === String(userId),
      participants: getParticipantsForUser(participants)
    });

    return accum; 
  }, []);

}

function getParticipantsForUser(participants) {
  return participants.reduce((accum, { email }) => {
    accum.push(email);
    return accum;
  }, []);
}

module.exports = {
  getAllProjects,
  addProject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  updateParticipants
}