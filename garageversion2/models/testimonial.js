const { Model, DataTypes } = require('sequelize');

class Testimonial extends Model {}

Testimonial.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    message: DataTypes.TEXT,
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'testimonial'
});

module.exports = Testimonial;
