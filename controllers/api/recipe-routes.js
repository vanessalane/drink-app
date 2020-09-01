const router = require('express').Router();
const { Recipe, Ingredient, RecipeIngredient, User } = require ('../../models');

// GET All Ingredients
router.get('/', (req, res) => {
    Recipe.findAll({
        attributes: ['recipe_id', 'recipe_name', 'instructions', 'image_file_name', 'rating'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Ingredient,
                attributes: ['ingredient_id', 'ingredient_name'],
                as: 'ingredients',
                through: {
                  attributes: ['amount'],
                  as: 'ingredient_amount'
                }
            },
        ],
    })
    .then(loadedRecipes => res.json(loadedRecipes))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

module.exports = router;