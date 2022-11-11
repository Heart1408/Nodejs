'use strict';
const {
  Model
} = require('sequelize');
const orderdetail = require('./orderdetail');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.SizeShoe, {foreignKey: 'product_id'})
      //Product.belongsTo(models.Category, { foreignKey: 'category_id' })
      Product.hasMany(models.Product_Category, {foreignKey: 'product_id'})

    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};