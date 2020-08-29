const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Ingredient extends Model {}

Ingredient.init(
  {
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ingredient_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Ingredient',
  }
);

module.exports = Ingredient;