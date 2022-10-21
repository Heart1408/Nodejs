'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SizeShoe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SizeShoe.belongsTo(models.Product, {foreignKey: 'product_id'});
      SizeShoe.hasMany(models.OrderDetail, {foreignKey: 'product_size_id'});
      SizeShoe.belongsTo(models.Size, {foreignKey: 'size_id'});
    }
  }
  SizeShoe.init({
    size_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SizeShoe',
  });
  return SizeShoe;
};