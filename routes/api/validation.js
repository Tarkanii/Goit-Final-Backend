const router = require('express').Router();
const { validationControllers: controllers } = require('../../controllers');

router.get('/', controllers.getValidationRules);

module.exports = router;