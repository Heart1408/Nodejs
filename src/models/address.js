'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.User, {foreignKey: "user_id"})
      Address.hasMany(models.Order, {foreignKey: "userInfo"})
    }
  }
  Address.init({
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    receiver_name: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};