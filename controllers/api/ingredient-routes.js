const router = require('express').Router();
const { Ingredient, Recipe} = require ('../../models');

// GET All Ingredients
// /api
router.get('/',( reg, res) => {
    Ingredient.findAll({
        attributes:[
            'ingredient_id','ingredient_name']
            ,
        order: [['ingredient_name', 'ASC']],
        include: [
            {
                model: Recipe,
                attributes: ['recipe_id'],
                as: 'ingredients',
                through: {
                    attributes: ['amount'],
                    as: 'ingredient_amount'
                  }
            },
        ],
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    })

// GET one ingredient by ingredient_id
// /api/ingredients/1
router.get('/:id',( req, res) => {
    Ingredient.findOne({
        where: {
            ingredient_id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// POST to add an ingredient
// /api/ingredient
// Required body:
// {
//     "ingredient_name": "orange peel"
// }
router.post('/', (req, res) => {
    Ingredient.create({
        ingredient_name: req.body.ingredient_name,
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.ingredient_id = dbUserData.ingredient_id;
            req.session.ingredient_name = dbUserData.ingredient_name;
            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;