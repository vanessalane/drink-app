const router = require('express').Router();
const ingredientRoutes = require('./ingredient-routes.js');
const recipeRoutes = require('./recipe-routes.js');
const userRoutes = require('./user-routes.js');

router.use('/ingredients', ingredientRoutes);
router.use('/recipes', recipeRoutes);
router.use('/users', userRoutes);

module.exports = router;