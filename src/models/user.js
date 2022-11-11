'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cart, {foreignKey: 'user_id'})
      User.hasMany(models.Address, {foreignKey: 'user_id'})
    }
  }
  User.init({  
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,  
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_token: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};