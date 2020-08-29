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
            type: DataTypes.TEXT,
            allowNull: false
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.TEXT,
            allowNull: false,
            // add in once the user model exists 
            // references: {
            //     model: 'User',
            //     key: 'user_id'
            // }
        },
        image_file_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['recipe_name', 'user_id']
            }
        ]
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