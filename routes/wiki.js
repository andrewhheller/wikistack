// ### EXPRESS ROUTER FOR WIKIS ###


// bring in express and instantiate router
const express = require('express');
const router = express.Router();

// routes
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikipage');
const mainPage = require('../views/main');
const editPage = require('../views/editPage');

// data models
const {db, Page, User, generateSlug} = require('../models');

// main route for wikis
router.get('/', async (req, res, next) => {

  try {

    // grab all pages
    const pages = await Page.findAll();
    
    // console.log(pages[0].dataValues);

    // pass pages array to main page view
    res.send(mainPage(pages));
  }
  catch (error) {
    next(error);
  }

});


router.get('/add', (req, res, next) => {

  try {
    // just send add page view
    res.send(addPage());
  }
  catch (error) {
    next(error);
  }

})

router.get('/search', async (req, res, next) => {

  try {

    // console.log(req.query.search);

    // grab all pages where lower case title or case is found
    const pages = await Page.findAll({

      where: {
        $or: {
          title: db.where(db.fn('LOWER', db.col('title')), 'LIKE', '%' + req.query.search.toLowerCase() + '%'),
          content: db.where(db.fn('LOWER', db.col('content')), 'LIKE', '%' + req.query.search.toLowerCase() + '%')
        }
      }

    })

    // console.log(pages);

    // send results to main page view
    res.send(mainPage(pages));
  }
  catch (error) {
    next(error);    
  }

});


router.get('/:slug/similar', async (req, res, next) => {


  try {

    // grab page by slug
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    })

    // console.log(page.title);

    // grab all pages where lower case title or case is found
    const pages = await Page.findAll({

      where: {
        $or: {
          title: db.where(db.fn('LOWER', db.col('title')), 'LIKE', '%' + page.title.toLowerCase() + '%'),
          content: db.where(db.fn('LOWER', db.col('content')), 'LIKE', '%' + page.content.toLowerCase() + '%')
        }
      }

    })

    // send result to main page view
    res.send(mainPage(pages));

  }
  catch (error) {
    next(error);
  }

})



router.get('/:slug', async (req, res, next) => {

  // console.log(req.params.slug);

  try {
    // grab page by its slug
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    // console.log(page);

    // error handling: no page with slug found
    if(!page) {
      res.status(404).send('Oops, that wiki is not found :(')
    }
    else {
      // grab user by the authorId foreign key
      const user = await page.getAuthor();

      // console.log(user.dataValues);
      
      // show wikiPage view that diplays all pages for that user
      res.send(wikiPage(page, user.dataValues));
    }
  }
  catch (error) {
    next(error)
  }
});


router.get('/:slug/edit', async (req, res, next) => {

  try{

    // get page data by its slug
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    // console.log(page.dataValues);

    if(!page) {
      res.status(404).send('Oops, that wiki is not found :(');
    }
    else {
      // grab author by the authorId foreign key
      const user = await page.getAuthor();

      // show edit wiki page with page and user data fields pre-populated
      res.send(editPage(page, user.dataValues));
    }

  }
  catch (error) {
    next(error);
  }

});


router.post('/:slug', async (req, res, next) => {

  try{

    // grab page by slug
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    // update page
    await page.update({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status
    })

    // create new slug (reg-exp)
    await page.update({
      slug: generateSlug(page.title)
    })
    
    // redirect to new slug
    res.redirect(`/wiki/${page.slug}`);

  }
  catch (error) {
    next(error);
  }

});


router.post('/', async (req, res, next) => {

  try {
    // console.log(page.dataValues);
    // console.log(user.dataValues)

    // find or create user
    const [user, wasCreated] = await User.findOrCreate({

      where: {
        name: req.body.name,
        email: req.body.email
      }

    });

    // grab body of page data
    const page = await Page.create(req.body);

    // set authorId of page to matching user
    page.setAuthor(user);
    
    // redirect to newly created page
    res.redirect(`/wiki/${page.slug}`);
  }
  catch (error) {
    next(error);
  }

});

router.delete('/:slug', async (req, res, body) => {

  try{

    // grab page by slug
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    // delete page by finding its slug
    const deletePage = await Page.destroy({
      where: {
        slug: req.params.slug
      }
    })

    // rediret to main wiki page
    res.redirect('/wiki');

  }
  catch (error) {
    throw(error);
  }

});



module.exports = router;
