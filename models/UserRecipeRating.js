const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserRecipeRating extends Model {};

UserRecipeRating.init(
        {
        urr_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }, 
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            references: {
                model: 'User',
                key: 'user_id'
            }
        }, 
        recipe_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true, 
            references: {
                model: 'recipe',
                key: 'recipe_id'
            }
        },
        rating: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'UserRecipeRating'
    }
);

module.exports = Recipe;

