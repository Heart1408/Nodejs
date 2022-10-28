'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, {foreignKey: "user_id"})
      Cart.belongsTo(models.SizeShoe, {foreignKey: 'product_size_id'})
    }
  }
  Cart.init({
    user_id: DataTypes.INTEGER,
    sizeshoe_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};