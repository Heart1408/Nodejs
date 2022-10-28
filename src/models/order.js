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
      Order.belongsTo(models.User, {foreignKey: "user_id"})
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    receive_name: DataTypes.STRING,
    ordertime: DataTypes.DATE,
    delivery: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};