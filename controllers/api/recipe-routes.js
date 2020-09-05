const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Ingredient, Recipe, RecipeIngredient, User, UserRecipeRating } = require('../../models');

// GET All Recipes
router.get('/', (req, res) => {
    Recipe.findAll({
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
    .then(dbRecipeData => {
        if (!dbRecipeData){
            res.status(400).json({message: "No recipes found"});
            return;
        }
        res.json(dbRecipeData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
})

// GET one Recipe
router.get('/:id', (req, res) => {
    Recipe.findOne({
        where: { recipe_id : req.params.id },
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
    .then(dbRecipeData => {
        if (!dbRecipeData){
            res.status(400).json({message: "No recipe found with that id"});
            return;
        }
        res.json(dbRecipeData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// POST /api/recipes
// Expected body:
// {
//     "recipe_name": "Sangria",
//     "instructions": "Take some wine and some fruit and go to Spain.  Mix it all together and have a great time.",
//     "image_file_name": "https://i.pinimg.com/originals/e2/8d/d6/e28dd65b6d34ee283526242b4313dc70.jpg",
//     "ingredients": [
//         {
//             "ingredient_name": "orange",
//             "ingredient_amount": "1 medium"
//         },
//         {
//             "ingredient_name": "red wine",
//             "ingredient_amount": "1 bottle"
//         }
//     ]
// }
// This gets you a 200 respose
router.post('/', (req, res) => {

    // create the recipe
    Recipe.create({
        recipe_name: req.body.recipe_name,
        instructions: req.body.instructions,
        image_file_name: req.body.image_file_name,
        user_id: req.body.user_id
        // user_id: req.session.user_id
    })
    .then(dbRecipeData => {
        console.log({"New dbRecipeData": dbRecipeData.dataValues});

        // create the rating
        UserRecipeRating.create({
            recipe_id: dbRecipeData.recipe_id,
            user_id: req.body.user_id
        })
        .then(dbUserRecipeRatingData => {
            console.log({"New UserRecipeRating": dbUserRecipeRatingData.dataValues});
        })
        .catch(err => {
            console.log(err);
        })


        // create the ingredients
        const ingredients = req.body.ingredients;
        ingredients.forEach(ingredient => {
            Ingredient.create({
                ingredient_name: ingredient.ingredient_name
            })
            .then(dbIngredientData => {
                console.log({"New Ingredient": dbIngredientData.dataValues});

                // associate the recipe with an ingredient
                RecipeIngredient.create({
                    ingredient_id: dbIngredientData.ingredient_id,
                    recipe_id: dbRecipeData.recipe_id,
                    amount: ingredient.ingredient_amount
                })
                .then(dbRecipeIngredientData => {
                    console.log({"New RecipeIngredient": dbRecipeIngredientData.dataValues});
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
        })
        res.json(dbRecipeData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
   });
});

// PUT /api/users/1
// Expected body:
// {
//     "recipe_name": "Sangria but different",
//     "instructions": "Mostly juice but pretty good regardless.",
//     "user_id": "2",
//     "image_file_name": "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2020/05/Red-Sangria-7.jpg",
// }
// This gets you a 200 respose
router.put('/:id', (req, res) => {
    Recipe.update(req.body, {
        individualHooks: true,
        where: {
            recipe_id: req.params.id
        }
    })
    .then(dbRecipeData => {
        if (!dbRecipeData[0]) {
            res.status(404).json({ message: 'No recipe found with this id' });
            return;
        }
        res.json(dbRecipeData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;