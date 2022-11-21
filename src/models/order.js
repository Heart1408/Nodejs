'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderDetail, {foreignKey: 'order_id'})
      Order.belongsTo(models.Address, {foreignKey: "userInfo"})
    }
  }
  Order.init({
    userInfo: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    ordertime: DataTypes.DATE,
    delivery: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};