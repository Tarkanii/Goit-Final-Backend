const validationControllers = require('./validation');
const authControllers = require('./auth');
const projectsControllers = require('./projects');
const sprintsControllers = require('./sprints');
const tasksControllers = require('./tasks');

module.exports = {
  validationControllers,
  authControllers,
  projectsControllers,
  sprintsControllers,
  tasksControllers
}