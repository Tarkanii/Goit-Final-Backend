const router = require('express').Router();
const { controllerWrapper, validation, authentication } = require('../../middlewares');
const { tasksControllers: controllers } = require('../../controllers');
const { joiSchema, joiUpdateSpentHoursSchema } = require('../../models/task');

router.post('/', authentication, validation(joiSchema), controllerWrapper(controllers.addTask));

router.patch('/:id/name', authentication, controllerWrapper(controllers.updateTaskName));

router.patch('/:id/spent', authentication, validation(joiUpdateSpentHoursSchema), controllerWrapper(controllers.updateSpentDay));

router.delete('/:id', authentication, controllerWrapper(controllers.deleteTask));

module.exports = router;