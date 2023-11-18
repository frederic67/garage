// models/account.js
module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING 
    });
  
    return Account;
  };
  
  