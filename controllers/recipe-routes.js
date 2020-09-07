const router = require('express').Router();
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');
const { Ingredient, Recipe, User } = require('../models');

router.get('/add', withAuth, (req, res) => {
    res.render('add_recipe', {
        no_hero: true,
        loggedIn: req.session.loggedIn,
        loggedInUser: req.session.username
    });
});

// route for the recipe page
router.get('/:recipe_id', (req, res) => {
    Recipe.findOne({
        where: { recipe_id : req.params.recipe_id },
        attributes: [
            'recipe_id',
            'recipe_name',
            'instructions',
            'image_url',
            'created_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM UserRecipeRating WHERE UserRecipeRating.recipe_id = Recipe.recipe_id)`), 'rating_count'],
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Ingredient,
                attributes: ['ingredient_id', 'ingredient_name'],
                as: 'recipe_ingredients',
                through: {
                    attributes: ['amount'],
                    as: 'ingredient_amount'
                }
            },
        ],
    })
    .then(loadedRecipe => {
        let templateData;
        if (!loadedRecipe) {
            templateData = {
                no_hero: true,
                include_homepage_button: true,
                error: "Sorry, this recipe couldn't be loaded.",
                loggedIn: req.session.loggedIn,
                loggedInUser: req.session.username,
                belongsToUser: req.session.username === recipe.User.username
            }
        } else {
            const recipe = loadedRecipe.get({ plain: true });
            templateData = {
                no_hero: true,
                recipe: recipe,
                loggedIn: req.session.loggedIn,
                loggedInUser: req.session.username,
                belongsToUser: req.session.username === recipe.User.username
            }
        }
        res.render('single_recipe', templateData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});


module.exports = router;