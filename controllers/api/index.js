const router = require('express').Router();
const ingredientRoute = require('./ingredient-route.js');
const recipeRoute = require('./recipe-route.js');
const userRoute = require('./user-route.js');

router.use('/recipe', recipeRoute);
// router.use('/api', apiRoutes);
router.use('/user', userRoute);
router.use('/user', ingredientRoute);


module.exports = router;