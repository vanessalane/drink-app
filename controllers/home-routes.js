const router = require('express').Router();
const sequelize = require('../config/connection');
const { Recipe, User } = require('../models');

router.get('/', (req, res) => {
    Recipe.findAll({
        attributes: [
            'recipe_id',
            'recipe_name',
            'instructions',
            'image_url',
            'created_at',
            'updated_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM UserRecipeRating WHERE UserRecipeRating.recipe_id = Recipe.recipe_id)`), 'rating_count'],
            [sequelize.literal(`(SELECT AVG(rating) FROM UserRecipeRating WHERE UserRecipeRating.recipe_id = Recipe.recipe_id)`), 'rating'],
        ],
        order: [
            [sequelize.literal('rating_count'), 'DESC'],
            [sequelize.literal('rating'), 'DESC'],
            ['updated_at', 'DESC']
        ]
    })
    .then(loadedRecipes => {
        let templateData;
        if (loadedRecipes.length === 0) {
            if (req.session.loggedIn) {
                templateData = {
                    big_hero: true,
                    hero_eyebrow: "it's time to",
                    hero_title: "drink app!",
                    error: "No drinks have been added!",
                    include_add_recipe_button: true,
                    loggedIn: req.session.loggedIn,
                    loggedInUser: req.session.username
                };
            } else {
                templateData = {
                    big_hero: true,
                    hero_eyebrow: "it's time to",
                    hero_title: "drink app!",
                    error: "Log in or sign up to add a drink.",
                    include_login_button: true,
                    loggedIn: req.session.loggedIn,
                    loggedInUser: req.session.username
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
                loggedInUser: req.session.username,
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
                'image_url',
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
                    error: `${req.session.username} hasn't added any drinks!`,
                    loggedIn: req.session.loggedIn,
                    loggedInUser: req.session.username
                };
            } else {
                const recipes = loadedRecipes.map(recipe => recipe.get({ plain: true }));
                templateData = {
                    hero_eyebrow: "drinks by",
                    hero_title: `${req.params.username}`,
                    recipes,
                    loggedIn: req.session.loggedIn,
                    loggedInUser: req.session.username
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
            loggedIn: req.session.loggedIn,
            loggedInUser: req.session.username
        };
        res.render('multiple_recipes', templateData);
    })
});

module.exports = router;