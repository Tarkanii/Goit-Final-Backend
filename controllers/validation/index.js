const validationRules = require('../../assets/validation.json');

const getValidationRules = (req, res) => {
  res.json({
    data: validationRules
  });
}

module.exports = {
  getValidationRules
}