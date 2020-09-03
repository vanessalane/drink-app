// import models
const Ingredient = require('./Ingredient');
const Recipe = require('./Recipe');
const RecipeIngredient = require('./RecipeIngredient');
const User = require('./User');
const UserRecipeRating = require('./UserRecipeRating')

// User hasMany recipes, Recipe belongsTo one User
User.hasMany(Recipe, {
  foreignKey: 'user_id'
});

Recipe.belongsTo(User, {
  foreignKey: 'user_id'
});

// User Ratings belongToMany Recipes (through UserRecipeRating)
User.belongsToMany(Recipe, {
  through: UserRecipeRating,
  as: 'recipe_rating',
  foreignKey: 'user_id'
})

User.hasMany(RecipeIngredient, {
  foreignKey: 'user_id'
});

// Recipe Ratings belongToMany Users (through UserRecipeRating)
Recipe.belongsToMany(User, {
  through: UserRecipeRating,
  as: 'recipe_rating',
  foreignKey: 'recipe_id'
})

Recipe.hasMany(RecipeIngredient, {
  foreignKey: 'recipe_id'
});

// Ingredients belongToMany Recipes (through RecipeIngredient)
Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  as: 'recipe_ingredients',
  foreignKey: 'ingredient_id'
})

Ingredient.hasMany(RecipeIngredient, {
  foreignKey: 'ingredient_id'
});

// Recipes belongToMany Ingredients (through RecipeIngredient)
Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  as: 'recipe_ingredients',
  foreignKey: 'recipe_id'
})

Recipe.hasMany(RecipeIngredient, {
  foreignKey: 'recipe_id'
});

// RecipeIngredients belongs to Recipe and Ingredient
RecipeIngredient.belongsTo(Recipe, {
  foreignKey: 'recipe_id'
});

RecipeIngredient.belongsTo(Ingredient, {
  foreignKey: 'ingredient_id'
});

// UserRecipeRating belongs to User and Recipe
UserRecipeRating.belongsTo(User, {
  foreignKey: 'user_id'
});

UserRecipeRating.belongsTo(Recipe, {
  foreignKey: 'recipe_id'
});


// export models
module.exports = {
  Recipe,
  Ingredient,
  RecipeIngredient,
  User,
  UserRecipeRating
};
