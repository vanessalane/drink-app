const router = require('express').Router();
const aws = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');

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
//     "filename": "/sangria.jpg",
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

// Multer Middleware
var upload = multer({
    dest: __dirname + './uploads/',
    limits: {fileSize: 1000000, files:1},
});

router.post('/', upload.single('imageFile'), (req, res) => {
    console.log({
        body: req.body,
        recipe_name: req.body.recipeName,
        instructions: req.body.instructions,
        files: req.files
    })

    let s3Data = {
        image_url: '',
        image_file_name: ''
    };

    if (req.files) {
        console.log("******* UPLOADING THE FILE TO AWS *******")
        var file = req.files.file-input;

        // Set the AWS config
        aws.config.update({
            region: process.env.S3_REGION,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            }
        });

        // create S3 service object
        const s3 = new aws.S3();
        const image_id = '10000' + parseInt(Math.random() * 10000000);
        const params = {
            ACL: 'public-read',
            Bucket: process.env.S3_BUCKET,
            Body: fs.createReadStream(file.path),
            Key: `recipe_images/${image_id}`
        };

        // upload the file
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err;
            s3Data = data
        })
    }

    // create the recipe
    console.log("******* CREATING A NEW RECIPE *******")
    Recipe.create({
        recipe_name: req.body.recipeName,
        instructions: req.body.instructions,
        image_url: s3Data.image_url,
        image_file_name: s3Data.image_file_name,
        user_id: req.session.user_id
    })
    .then(dbRecipeData => {
        console.log({"New dbRecipeData": dbRecipeData.dataValues});

        // create the rating
        UserRecipeRating.create({
            recipe_id: dbRecipeData.recipe_id,
            user_id: req.session.user_id
        })
        .then(dbUserRecipeRatingData => {
            console.log({"New UserRecipeRating": dbUserRecipeRatingData.dataValues});
        })
        .catch(err => {
            console.log(err);
        })

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

                console.log({i, ingredientAmounts});

                // associate the recipe with an ingredient
                RecipeIngredient.create({
                    ingredient_id: dbIngredientData[0].ingredient_id,
                    recipe_id: dbRecipeData.recipe_id,
                    amount: ingredientAmounts[i]
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
        res.json(dbRecipeData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;