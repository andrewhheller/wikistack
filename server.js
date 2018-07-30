const app = require('./app.js');

const port = process.env.PORT || 3000;

app.listen(port, (req, res, next) => {
  console.log(`listening on port... ${port}`);
});
