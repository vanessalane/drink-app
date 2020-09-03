const router = require('express').Router();
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');
const { Ingredient, Recipe, User } = require('../models');

router.get('/add', withAuth, (req, res) => {
    res.render('add_recipe', {
        no_hero: true,
        loggedIn: req.session.loggedIn
    });
});

// route for the user page
router.get('/:recipe_id', (req, res) => {
    Recipe.findOne({
        where: { recipe_id : req.params.recipe_id },
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
        const recipe = loadedRecipe.get({ plain: true })
        res.render('single_recipe', {
            hero_title: recipe.recipe_name,
            hero_subtitle: recipe.User.username,
            image_file_name: recipe.image_file_name,
            instructions: recipe.instructions,
            ingredients: recipe.recipe_ingredients,
            rating: recipe.rating,
            rating_count: recipe.rating_count,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});


module.exports = router;