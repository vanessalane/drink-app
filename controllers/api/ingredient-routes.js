const router = require('express').Router();
const { Post,  Ingredient} = require ('../../models');

//GET All Recipe

router.get('/',( reg, res) => {
    Ingredient.findAll({
        attributes:[
            'ingredient_id','ingredient_name']
            ,
        order: [['created_at', 'DESC']],
        include: [
            // {
            //     model:Ingredient ,
            //     attributes: ['ingredient_id']
            // },
            {
                model:RecipeIngredient,
                attributes:['ri_id', 'amount'],
            },
            {
                model: Recipe,
                attributes: ['recipe_id']
            },
        ],
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    })

module.exports = router;