// express
const express = require('express');
const app = express();

// data models
const { db } = require('./models');

// middleware
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// router paths
const wikisRoute = require('./routes/wiki');
const userRoute = require('./routes/user')

// method override
app.use(methodOverride('_method'));

// logging middleware
app.use(morgan('dev'));

// static path middleware
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.urlencoded());

// router sub-paths
app.use('/wiki', wikisRoute);
app.use('/users', userRoute);

// main route redirection
app.get('/', (req, res, next) => {
  res.redirect('/wiki')
});








module.exports = app;
