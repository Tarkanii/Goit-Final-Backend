const router = require('express').Router();
const { authentication, validation, controllerWrapper, isOwner } = require('../../middlewares');
const { projectsControllers: controllers } = require('../../controllers');
const { joiSchema } = require('../../models/project');

router.get('/', authentication, controllerWrapper(controllers.getAllProjects));

router.get('/:projectId', authentication, controllerWrapper(controllers.getProjectById));

router.post('/', authentication, validation(joiSchema), controllerWrapper(controllers.addProject));

router.put('/:projectId', authentication, controllerWrapper(controllers.updateProjectById));

router.delete('/:projectId', authentication, controllerWrapper(isOwner), controllerWrapper(controllers.deleteProjectById));

router.patch('/:projectId/participants', authentication, controllerWrapper(isOwner), controllerWrapper(controllers.updateParticipants));

module.exports = router;