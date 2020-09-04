const router = require('express').Router();
const sequelize = require('../config/connection');
const { Recipe, User } = require('../models');

router.get('/', (req, res) => {
    Recipe.findAll()
    .then(loadedRecipes => {
        let templateData;
        if (loadedRecipes.length === 0) {
            let errorMsg;
            if (req.session.loggedIn) {
                templateData = {
                    big_hero: true,
                    hero_eyebrow: "it's time to",
                    hero_title: "drink app",
                    error: "No drinks have been added!",
                    include_add_recipe_button: true,
                    loggedIn: req.session.loggedIn
                };
            } else {
                templateData = {
                    big_hero: true,
                    hero_eyebrow: "it's time to",
                    hero_title: "drink app",
                    error: "No drinks have been added! Log in or sign up to share one.",
                    include_login_button: true,
                    loggedIn: req.session.loggedIn
                };
            }
        } else {
            const recipes = loadedRecipes.map(recipe => recipe.get({ plain: true }));
            templateData = {
                big_hero: true,
                hero_eyebrow: "it's time to",
                hero_title: "drink app",
                recipes,
                loggedIn: req.session.loggedIn,
                scroll_top_button: true
            };
        }
        res.render('multiple_recipes', templateData);
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
router.get('/user/:username', (req, res) => {
    User.findOne({
        where: {username: req.params.username},
        attributes: ['user_id']
    })
    .then(foundUser => {
        Recipe.findAll({
            where: { user_id : foundUser.user_id },
            attributes: [
                'recipe_id',
                'recipe_name',
                'instructions',
                'image_file_name',
                [sequelize.literal(`(SELECT COUNT(*) FROM UserRecipeRating WHERE UserRecipeRating.recipe_id = Recipe.recipe_id)`), 'rating_count'],
                [sequelize.literal(`(SELECT AVG(rating) FROM UserRecipeRating WHERE UserRecipeRating.recipe_id = Recipe.recipe_id)`), 'rating'],
            ],
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'username']
                }
            ]
        })
        .then(loadedRecipes => {
            let templateData;
            if (loadedRecipes.length === 0) {
                templateData = {
                    no_hero: true,
                    include_homepage_button: true,
                    error: "This user hasn't added any drinks!",
                    loggedIn: req.session.loggedIn
                };
            } else {
                const recipes = loadedRecipes.map(recipe => recipe.get({ plain: true }));
                templateData = {
                    hero_eyebrow: `${req.params.username}'s recipes`,
                    recipes,
                    loggedIn: req.session.loggedIn
                };
            }
            res.render('multiple_recipes', templateData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    })
    .catch(err => {
        templateData = {
            no_hero: true,
            include_homepage_button: true,
            error: `No user found with the username ${req.params.username}!`,
            loggedIn: req.session.loggedIn
        };
        res.render('multiple_recipes', templateData);
    })
});

module.exports = router;