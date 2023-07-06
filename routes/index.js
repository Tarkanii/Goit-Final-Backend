const validationRoutes = require('./api/validation');
const authRouter = require('./api/auth');
const projectsRouter = require('./api/projects');

module.exports = { 
  validationRoutes,
  authRouter,
  projectsRouter
};