const router = require('express').Router();
const { UserRecipeRating } = require('../../models');

// POST /api/reciperatings
// add or update a new rating for a given recipe
// Expected body:
// {
//     "user_id": "1",
//     "recipe_id": "1",
//     "rating": "1.0"
// }
router.post('/', (req, res) => {
    UserRecipeRating.upsert(req.body)
    .then(dbUserRecipeRatingData => res.json(dbUserRecipeRatingData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
   });
});

module.exports = router;