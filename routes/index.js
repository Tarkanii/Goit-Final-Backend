const validationRoutes = require('./api/validation');
const authRouter = require('./api/auth');
const projectsRouter = require('./api/projects');
const sprintsRouter = require('./api/sprints');

module.exports = { 
  validationRoutes,
  authRouter,
  projectsRouter,
  sprintsRouter
};