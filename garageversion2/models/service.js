// models/service.js
module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL(10, 2) // Pour gérer les prix avec des décimales
    });
  
    return Service;
  };
  
  