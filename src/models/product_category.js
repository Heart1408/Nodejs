const { Op } = require("sequelize");
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_Category.belongsTo(models.Category, { foreignKey: 'category_id' })
      Product_Category.belongsTo(models.Brand, { foreignKey: 'brand_id' })
      Product_Category.belongsTo(models.Product, { foreignKey: 'product_id' })
    }
  }
  Product_Category.init({
    product_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    brand_id: DataTypes.INTEGER
  }, {
    scopes: {
      filterProduct(categoryId, brandId) {
        return {
          where: {
            [Op.and]: [
              categoryId ? { 'category_id': categoryId } : null,
              brandId ? { 'brand_id': brandId } : null
            ]
          }
        }
      }
    },
    sequelize,
    modelName: 'Product_Category',
  });
  return Product_Category;
};