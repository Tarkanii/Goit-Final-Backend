const router = require('express').Router();
const { authControllers: controllers } = require('../../controllers/');
const { controllerWrapper, validation, authentication } = require('../../middlewares');
const { joiSchema } = require('../../models/user');

router.post('/register', validation(joiSchema), controllerWrapper(controllers.register));

router.post('/login', validation(joiSchema), controllerWrapper(controllers.login));

router.get('/logout', authentication, controllerWrapper(controllers.logout));

module.exports = router;