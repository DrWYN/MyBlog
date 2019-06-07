const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello express');
})

module.exports = router;

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.redirect('/posts');
  });

  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/posts', require('./posts'));
  app.use('/comments', require('./comments'));

  app.use(function(req, res) {
    if (!res.headersSent) {
      res.status(404).render('404');
    }
  });
}
