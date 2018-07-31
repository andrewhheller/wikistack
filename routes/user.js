// ### EXPRESS ROUTER FOR USERS ###

// bring in express and instantiate router
const express = require('express');
const router = express.Router();

// views
const userList = require('../views/userList');
const userPages = require('../views/userPages');

// data models
const {Page, User} = require('../models');

// users home page route
router.get('/', async (req, res, next) => {

  try {

    // grab all users
    const users = await User.findAll();

    // pass users to userList view function
    res.send(userList(users));
  }
  catch (error) {
    next(error);
  }

});


// user id route
router.get('/:id', async (req, res, next) => {

  try {

    // grab user by id
    const user = await User.findById(req.params.id);

    // grab all pages for that user by id
    const pages = await Page.findAll({
      where: {
        authorId: req.params.id
      }
    })

    // send userPages view passing in user data and pages
    res.send(userPages(user.dataValues, pages));

  }
  catch (error) {
    next(error);
  }

})



module.exports = router;
