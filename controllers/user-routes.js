// HTML routes for user
const router = require('express').Router();

router.get('/login', (req, res) => {
  res.render('login', {
      hero_eyebrow: "log in"
  });
});

module.exports = router;
