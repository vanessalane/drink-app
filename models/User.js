const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {};

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            allowNull: false,
            autoIncrement: true
        }, 
        username: {
            type: DataTypes.TEXT, 
            allowNull: false, 
            // unique: true
        }, 
        password: {
            type: DataTypes.TEXT, 
            allowNull: false, 
            validate: {
                len: [4]
            }
        }, 
        email: {
            type: DataTypes.TEXT, 
            allowNull: false, 
            // unique: true, 
            validate: {
                isEmail: true
            }
        }
    }, 
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'User'
    },
    {
    indexes: [
        {
            unique: true,
            fields: ['username']
        }
    ]}
);

module.exports = User;

