const controllerWrapper = (action) => {
  return async (req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      console.log('Controller Wrapper Error:\n', error.message);
      
      if (error.message.includes('Cast to ObjectId failed')) {
        error.status = 404;

        if (error.message.includes('project')) {
          error.message = 'Project not found';
        }

        if (error.message.includes('sprint')) {
          error.message = 'Sprint not found';
        }

        if (error.message.includes('task')) {
          error.message = 'Task not found';
        }
      }

      if (error.message.includes('validation failed')) {
        error.status = 400;
      }
      
      next(error);
    }
  }
}

module.exports = controllerWrapper;