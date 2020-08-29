const router = require('express').Router();
const homeRoutes = require('./home-routes.js');
const recipeRoutes = require('./recipe-routes.js');
const userRoutes = require('./user-routes.js');

router.use('/', homeRoutes);
router.use('/recipe', recipeRoutes);
router.use('/user', userRoutes);

module.exports = router;