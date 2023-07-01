const controllerWrapper = (action) => {
  return async (req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      console.log('Controller Wrapper Error:\n', error.message);
      if (error.message.includes('validation failed')) {
        error.status = 400;
      }
      
      next(error);
    }
  }
}

module.exports = controllerWrapper;