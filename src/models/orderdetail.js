'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.SizeShoe, { foreignKey: 'product_size_id' })
      OrderDetail.belongsTo(models.Order, { foreignKey: 'order_id' })
      OrderDetail.belongsTo(models.Review, { foreignKey: 'review_id' })
    }
  }
  OrderDetail.init({
    product_size_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    review_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};