const router = require('express').Router();
const { Post,  RecipeIngredient} = require ('../models');

//GET All Recipe

router.get('/',( reg, res) => {
    RecipeIngredient.findAll({
        attributes:[
            'ri_id',
            'recipe_id',
            'ingredient_id',
            'amount',


        ]
    })

})
module.exports = router;