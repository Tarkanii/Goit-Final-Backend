const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const { validationRoutes, authRouter, projectsRouter } = require('./routes');

app.use('/api/validation', validationRoutes);
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);

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