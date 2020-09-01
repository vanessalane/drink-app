const router = require('express').Router();
const {Recipe} = require('../models');

router.get('/', (req, res) => {
    Recipe.findAll()
    .then(loadedRecipes => {
        const recipes = loadedRecipes.map(recipe => recipe.get({ plain: true }));
        res.render('homepage', {
            big_hero: true,
            hero_eyebrow: "it's time to",
            hero_title: "drink app",
            recipes,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// route for the login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }

    res.render('login', {
        no_hero: true
    });
});

// route for the user page
router.get('/user/:id', (req, res) => {
    res.render('user', {
        hero_eyebrow: "username"
    });
});

module.exports = router;