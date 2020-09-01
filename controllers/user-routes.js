// HTML routes for user
const router = require('express').Router();

router.get('/login', (req, res) => {
  res.render('login', {
      no_hero: true
  })
});

module.exports = router;
