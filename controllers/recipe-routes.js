const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/add', withAuth, (req, res) => {
    res.render('add_recipe', {
        no_hero: true,
        loggedIn: req.session.loggedIn
    });
});

router.get('/:id', (req, res) => {
    res.render('recipe', {
        hero_title: "recipe name",
        hero_subtitle: "author name",
        loggedIn: req.session.loggedIn
    });
});

module.exports = router;