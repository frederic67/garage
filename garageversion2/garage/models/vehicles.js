// models/vehicles.js
module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('Vehicle', {
      brand: DataTypes.STRING,
      model: DataTypes.STRING,
      year: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(10, 2)
    });
  
    return Vehicles;
  };
  