//** modello USER **/

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database_connection');

const User = sequelize.define('user', {
    nonce: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED, // SQLITE will use INTEGER
        defaultValue: Math.floor(Math.random() * 10000), // Initialize with a random nonce
    },
    publicAddress: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
},{
    timestamps: false,
});

module.exports = User;