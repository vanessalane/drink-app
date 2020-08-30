const router = require('express').Router();
const { Post,  Ingredient} = require ('../models');

//GET All Recipe

router.get('/',( reg, res) => {
    Ingredient.findAll({
        attributes:[
            'ingredient_id',
            'ingredient_name',
            'sequelize',

        ]
    })

})

module.exports = router;