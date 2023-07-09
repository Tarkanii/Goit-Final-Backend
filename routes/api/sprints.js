const router = require('express').Router();
const { authentication, validation, controllerWrapper } = require('../../middlewares');
const { joiSchema } = require('../../models/sprint');
const { sprintsControllers: controllers } = require('../../controllers');

router.get('/:id', authentication, controllerWrapper(controllers.getSprintById));

router.post('/', authentication, validation(joiSchema), controllerWrapper(controllers.addSprint));

router.patch('/:id/name', authentication, controllerWrapper(controllers.updateSprintName));

router.delete('/:id', authentication, controllerWrapper(controllers.deleteSprintById));

module.exports = router;