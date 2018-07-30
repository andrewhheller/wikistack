const express = require('express');
const app = express();

const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

// const routes = require('./routes/posts.js');

// app.use('/posts', routes);

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:id', (res, req, next) => {
  res.send('hello from posts');
})

app.get('/', (req, res, next) => {
  res.send('hello world');
});



module.exports = app;
