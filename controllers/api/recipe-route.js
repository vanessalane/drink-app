const router = require('express').Router();
const { Post, Recipe } = require ('../models');

//GET All Recipe

router.get('/',( reg, res) => {
    Recipe.findAll({
        attributes:[
            'recipe_id',
            'recipe_name',
            'instructions',
            'user_id',
            'image_file_name',
            'rating',
            'indexes',

        ]
    })

})

module.exports = router;