const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Recipe extends Model {};

Recipe.init(
    {
        recipe_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        recipe_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        instructions: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'user_id'
            }
        },
        image_file_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        rating_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'Recipe'
    }
);

module.exports = Recipe;