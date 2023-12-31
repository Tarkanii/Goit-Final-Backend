const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const { validationRouter, authRouter, projectsRouter, sprintsRouter, tasksRouter } = require('./routes');

app.use('/api/validation', validationRouter);
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/sprints', sprintsRouter);
app.use('/api/tasks', tasksRouter);

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not Found'
  });
});

app.use((error, req, res, next) => {
  const { status = 500, message = 'Server error' } = error;
  res.status(status).json({
    message
  });
});

module.exports = app;