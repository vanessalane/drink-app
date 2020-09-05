const router = require('express').Router();
const { RecipeIngredient } = require('../../models');

// PUT /api/recipeingredient
// Expected body:
// {
//     "recipe_id": "1",
//     "ingredient_id": "1",
//     "amount": "1 part"
// }
// This gets you a 200 respose
router.post('/', (req, res) => {
    RecipeIngredient.upsert(req.body)
    .then(dbRecipeIngredientData => res.json(dbRecipeIngredientData))
    .catch(err => {
        console.log(err);
        res.status(500).json(`Could not create RecipeIngredient: ${err}`);
   });
});

module.exports = router;