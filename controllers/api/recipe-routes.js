const router = require('express').Router();
const { Recipe, Ingredient, RecipeIngredient, User } = require('../../models');


// GET All Recipes
router.get('/', (req, res) => {
    Recipe.findAll({
        attributes: ['recipe_id', 'recipe_name', 'instructions', 'image_file_name', 'rating', 'rating_count'],
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

// GET one Recipe
router.get('/:id', (req, res) => {
    Recipe.findOne({
        where: { recipe_id : req.params.id },
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


// GET .api/recipes/1
    router.get('/:id',( req, res) => {
        Recipe.findOne({
            // attributes:['ingredient_id'],
            where: {
                    recipe_id: req.params.id
            },
            // include: [
            //     {
            //         model: Recipe,
            //         attributes: ['recipe_id'],
            //         as: 'ingredients',
            //         through: {
            //             attributes: ['amount'],
            //             as: 'ingredient_amount'
            //           }
            //     },
            // ],
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No recipe found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    });


// looking for this object to pass in 
// {
//     "recipe_name": "Sangria",
//     "instructions": "Take some wine and some fruit and go to Spain.  Mix it all together and have a great time.",
//     "user_id": "2",
//     "image_file_name": "https://i.pinimg.com/originals/e2/8d/d6/e28dd65b6d34ee283526242b4313dc70.jpg",
//     "rating": "3.6",
//     "rating_count": "3"
// }

router.post('/', (req, res) => {
    Recipe.create({
        recipe_name: req.body.recipe_name,
        instructions: req.body.instructions,
        user_id: req.body.user_id,
        image_file_name: req.body.image_file_name,
        rating: req.body.rating,
        rating_count: req.body.rating_count,
    })
    .then(dbUserData => {
        req.session.save(() => {
          req.session.recipe_name = dbUserData.recipe_name;
          req.session.instructions = dbUserData.instructions;
          req.session.user_id = dbUserData.user_id;
          req.session.image_file_name = dbUserData.image_file_name;
          req.session.rating = dbUserData.rating;
          req.session.rating_count = dbUserData.rating_count;
          res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
   });
});

// PUT /api/users/1
// Expected body includes the following:
// {
//     "recipe_name": "Sangria but different",
//     "instructions": "Mostly juice but pretty good regardless.",
//     "user_id": "2",
//     "image_file_name": "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2020/05/Red-Sangria-7.jpg",
//     "rating": "3.6",
//     "rating_count": "3"
// }
// This gets you a 200 respose
router.put('/:id', (req, res) => {
    Recipe.update (req.body, {
        individualHooks: true,
        where: {
            recipe_id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No recipe found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;