const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Ingredient, Recipe, RecipeIngredient, User, UserRecipeRating } = require('../../models');

// Set up AWS
const aws = require('aws-sdk');
aws.config.update({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

// create S3 service object
const s3 = new aws.S3();

// set up the multer-s3 engine
const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = multer({
    storage: multerS3({
        acl: 'public-read',
        s3: s3,
        bucket: process.env.S3_BUCKET,
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
          cb(null, Date.now().toString())
        }
    })
})

// GET All Recipes
router.get('/', (req, res) => {
    Recipe.findAll({
        attributes: [
            'recipe_id',
            'recipe_name',
            'instructions',
            'image_file_name',
            'image_url',
            'created_at',
            'updated_at',
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
            'image_url',
            [sequelize.literal(`(SELECT COUNT(*) FROM UserRecipeRating WHERE UserRecipeRating.recipe_id = Recipe.recipe_id)`), 'rating_count'],
            [sequelize.literal(`(SELECT AVG(rating) FROM UserRecipeRating WHERE UserRecipeRating.recipe_id = Recipe.recipe_id)`), 'rating'],
            'created_at',
            'updated_at'
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
// this POST will upload files to s3 if they've been submitted via the "Add a Recipe" form.
// It's not possible to update the image url or name through this endpoint.
// Expected body:
// {
//     "recipe_name": "Sangria",
//     "instructions": "Take some wine and some fruit and go to Spain.  Mix it all together and have a great time.",
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
router.post('/', upload.single('imageFile'), async (req, res) => {

    let newRecipe = {
        recipe_name: req.body.recipeName,
        instructions: req.body.instructions,
        user_id: req.session.user_id
    }

    // add image data if there is some
    if (req.file) {
        newRecipe.image_url = req.file.location;
        newRecipe.image_file_name = req.file.key;
    }

    // create the recipe
    await Recipe.create(newRecipe)
    .then(async dbRecipeData => {
        console.log({"New dbRecipeData": dbRecipeData.dataValues});

        // create the ingredients
        const ingredientNames = Array.isArray(req.body.ingredientName) ? req.body.ingredientName : [req.body.ingredientName];
        const ingredientAmounts = Array.isArray(req.body.ingredientAmount) ? req.body.ingredientAmount : [req.body.ingredientAmount];
        console.log({
            ingredientNames,
            ingredientAmounts
        })
        ingredientNames.forEach((ingredientName, i, ingredientNames) => {
            Ingredient.findOrCreate({
                where: {ingredient_name: ingredientName}
            })
            .then(dbIngredientData => {
                if (dbIngredientData[0]._options.isNewRecord) {
                    console.log({"New Ingredient": dbIngredientData[0].dataValues});
                } else {
                    console.log({"Found Ingredient": dbIngredientData[0].dataValues});
                }
    
                // associate the recipe with an ingredient
                RecipeIngredient.create({
                    ingredient_id: dbIngredientData[0].ingredient_id,
                    recipe_id: dbRecipeData.recipe_id,
                    amount: ingredientAmounts[i]
                })
                .then(dbRecipeIngredientData => console.log({"New RecipeIngredient": dbRecipeIngredientData.dataValues}))
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
        await res.redirect(`/recipe/${dbRecipeData.recipe_id}`);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE a recipe by recipe_id
router.delete('/:id', (req, res) => {
    // delete the s3 file
    Recipe.findOne({
        where: {recipe_id: req.params.id}
    })
    .then(dbRecipeData => {
        const fileKey = dbRecipeData.image_file_name;
        s3.deleteObject({
            Bucket: process.env.S3_BUCKET,
            Key: fileKey
        }, function(err, data) {

            // delete the recipe
            Recipe.destroy({
                where: {recipe_id: req.params.id}
            })
            .then(() => {
                res.json({message: "Recipe deleted", recipe_id: req.params.id})
            })
            .catch(err => res.status(500).json(err))
        });
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router;