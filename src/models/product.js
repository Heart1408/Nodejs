'use strict';
const { Op } = require("sequelize");
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
      Product.hasMany(models.SizeShoe, { foreignKey: 'product_id' })
      Product.hasMany(models.Product_Category, { foreignKey: 'product_id' })
      Product.belongsTo(models.Collection, { foreignKey: 'collection_id' })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    price: DataTypes.INTEGER,
    collection_id: DataTypes.INTEGER
  }, {
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {
      filter(keyword, maxPrice, minPrice, sortByPrice, collectionId) {
        return {
          where: {
            [Op.and]: [
              keyword ? {
                name: {
                  [Op.like]: '%' + keyword + '%',
                }
              } : null,
              minPrice ? { price: { [Op.gte]: minPrice } } : null,
              maxPrice ? { price: { [Op.lte]: maxPrice } } : null,
              collectionId ? { collection_id: collectionId } : null
            ]
          },
          order: sortByPrice ? [['price', sortByPrice]] : null
        }
      }
    },
    sequelize,
    modelName: 'Product',
  });
  return Product;
};