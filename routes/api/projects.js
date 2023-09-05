const router = require('express').Router();
const { authentication, validation, controllerWrapper } = require('../../middlewares');
const { projectsControllers: controllers } = require('../../controllers');
const { joiSchema } = require('../../models/project');

router.get('/', authentication, controllerWrapper(controllers.getAllProjects));

router.get('/:projectId', authentication, controllerWrapper(controllers.getProjectById));

router.post('/', authentication, validation(joiSchema), controllerWrapper(controllers.addProject));

router.put('/:projectId', authentication, controllerWrapper(controllers.updateProjectById));

router.delete('/:projectId', authentication, controllerWrapper(controllers.deleteProjectById));

router.put('/:projectId/participants', authentication, controllerWrapper(controllers.addParticipant));

router.delete('/:projectId/participants', authentication, controllerWrapper(controllers.deleteParticipant));

module.exports = router;