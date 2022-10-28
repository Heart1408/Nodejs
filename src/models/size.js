'use strict';
const {
  Model
} = require('sequelize');
const db = require('.');
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Size.hasMany(models.SizeShoe, {foreignKey: 'size_id'});
      // Size.belongsToMany(models.Product, {through: models.SizeShoe, uniqueKey: 'size_id'});
    }
  }
  Size.init({
    size: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Size',
  });
  return Size;
};