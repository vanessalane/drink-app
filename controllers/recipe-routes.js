const router = require('express').Router();

router.get('/add', (req, res) => {
    res.render('add_recipe', {
        hero_eyebrow: "add a recipe",
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