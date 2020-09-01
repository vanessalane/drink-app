const router = require('express').Router();
const ingredientRoutes = require('./ingredient-routes.js');
const recipeRoute = require('./recipe-routes.js');

router.use('/recipe', recipeRoutes);
router.use('/api', apiRoutes);

module.exports = router;