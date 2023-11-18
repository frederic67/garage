const { Model, DataTypes } = require('sequelize');
const database = require('../database');


class Hours extends Model {}

Hours.init({
    day: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    openTime: DataTypes.TIME,
    closeTime: DataTypes.TIME
}, {
    sequelize,
    modelName: 'hours'
});

module.exports = Hours;
