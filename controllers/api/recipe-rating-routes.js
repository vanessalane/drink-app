const router = require('express').Router();
const { UserRecipeRating } = require('../../models');

// POST /api/reciperatings
// add or update aa new rating for a given recipe
// Expected body:
// {
//     "user_id": "1",
//     "recipe_id": "1",
//     "rating": "1.0"
// }
// This gets you a 200 respose
router.post('/', (req, res) => {
    UserRecipeRating.upsert(req.body)
    .then(createdRating => res.json(createdRating))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
   });
});

module.exports = router;