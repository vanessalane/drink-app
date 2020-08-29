// import models
const Ingredient = require('./Ingredient');
const Recipe = require('./Recipe');
const RecipeIngredient = require('./RecipeIngredient');

// Ingredients belongToMany Recipes (through RecipeIngredient)
Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient
});
RecipeIngredient.belongsTo(Ingredient);

// Recipes belongToMany Ingredients (through RecipeIngredient)
Recipe.belongsToMany(Ingredient, {
    through: RecipeIngredient
});
RecipeIngredient.belongsTo(Recipe);

// export models
module.exports = {
  Recipe,
  Ingredient,
  RecipeIngredient
};
