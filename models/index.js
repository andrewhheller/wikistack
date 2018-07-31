// bring in Sequelize constructor function
const Sequelize = require('sequelize');

// connect to database by creating connection instance object of Sequelize
const db = new Sequelize('postgres://localhost/wikistack', {
  logging: true
});

// create user model
const User = db.define('user', {
  
  // name column
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  // emai column
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }

});

// create page model
const Page = db.define('page', {

    // slug column
    slug: {
      type: Sequelize.STRING,
      allowNull: false
    },

    // title column
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },

    // content column
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },

    status: {
      type: Sequelize.ENUM('open', 'closed')
    }

});

// sequelize association
// a page belongs to an author, on foreign key
// authorId
Page.belongsTo(User, {as: 'author'})

// create slug function
// replace spaces with '_' and remove all non alpha-numeric characters
const generateSlug = (title) => {
  return title.replace(/\s+/g, '_').replace(/\W/g, '');
}

// before page is validated
// place slug property as return value of generate slug with page title as arg
Page.beforeValidate(page => {
  page.slug = generateSlug(page.title);
});

// Page.afterUpdate(page => {
//   page.slug = generateSlug(page.title);
// })


// sync database
const sync = () => {
  return db.sync()
}




module.exports = {
  Page,
  User,
  sync,
  generateSlug,
  db
}
