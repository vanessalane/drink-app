const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class RecipeIngredient extends Model {};

RecipeIngredient.init(
    {
        ri_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        recipe_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Recipe',
                key: 'recipe_id'
            }
        },
        ingredient_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Ingredient',
                key: 'ingredient_id'
            }
        },
        amount: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'RecipeIngredient'
    },
    {
        indexes: {
            unique: true,
            fields: ['recipe_id', 'ingredient_id']  // shouldn't be able to add the same ingredient multiple times to the same recipe
        }
    }
);

module.exports = RecipeIngredient;