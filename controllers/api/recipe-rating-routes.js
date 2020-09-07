const router = require('express').Router();
const sequelize = require('../../config/connection');
const { UserRecipeRating } = require('../../models');


// GET /api/reciperatings/:id
// get the current user and rating for a given recipe
router.get('/:id', (req, res) => {
    UserRecipeRating.findOne({
        where: {recipe_id: req.params.id},
        attributes: [
            [sequelize.literal(`(SELECT COUNT(*) FROM UserRecipeRating WHERE recipe_id = ${req.params.id})`), 'rating_count'],
            [sequelize.literal(`(SELECT AVG(rating) FROM UserRecipeRating WHERE recipe_id = ${req.params.id})`), 'rating'],
        ]
    })
    .then(dbUserRecipeRatingData => {
        if (!dbUserRecipeRatingData) {
            res.json({
                user_id: req.session.user_id,
                rating: 0,
                rating_count: 0
            })
            return;
        }
        if (req.session.user_id) {
            res.json({
                user_id: req.session.user_id,
                rating: dbUserRecipeRatingData.rating,
                rating_count: dbUserRecipeRatingData.rating_count
            })
        } else {
            res.json(dbUserRecipeRatingData)
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
   });
});

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