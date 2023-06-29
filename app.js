const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

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