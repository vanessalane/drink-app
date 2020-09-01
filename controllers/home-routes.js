const router = require('express').Router();
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
    res.render('homepage', {
        // context variables for styling the handlebars template
        big_hero: true,
        hero_eyebrow: "it's time to",
        hero_title: "drink app",
        // variables for the template contents
        loggedIn: true
    });
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        // context variables for styling the handlebars template
        hero_eyebrow: "My Recipes",
        // variables for the template contents
        loggedIn: true
    });
});

// route for the login page
router.get('/login', (req, res) => {
    // if (req.session.loggedIn) {
    //   res.redirect('/');
    //   return;
    // }

    res.render('login', {
        no_hero: true
    });
});

module.exports = router;