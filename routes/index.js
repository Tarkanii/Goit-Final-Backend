const validationRouter = require('./api/validation');
const authRouter = require('./api/auth');
const projectsRouter = require('./api/projects');
const sprintsRouter = require('./api/sprints');
const tasksRouter = require('./api/tasks');

module.exports = { 
  validationRouter,
  authRouter,
  projectsRouter,
  sprintsRouter,
  tasksRouter
};