const { Project } = require('../models');

const isOwner = async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404).json({
      message: 'Project not found'
    });
    return;
  }
 
  if (req.originalUrl.includes('/participants') && req.body.action === 'delete') {
    req.project = project;
    next();
    return;
  }
  
  const isUserOwner = String(project.owner) === String(req.user._id);
  if (!isUserOwner) {
    res.status(403).json({
      message: 'No permission'
    });
    return;
  }

  req.project = project;
  next();
}

module.exports = isOwner;