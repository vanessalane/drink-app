const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserRecipeRating extends Model {};

UserRecipeRating.init({
        urr_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        rating: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                isDecimal: {
                    args: true,
                    msg: "Rating must be a decimal!"
                }
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'user_id'
            }
        }, 
        recipe_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Recipe',
                key: 'recipe_id'
            }
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

module.exports = UserRecipeRating;

