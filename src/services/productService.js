import category from '../models/category';
import db from '../models/index';
const { Op } = require("sequelize");
var sequelize = require('sequelize');

let getListProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let listProduct = await db.Product.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {
          [Op.and]: [
            data.keyword ? {
              name: {
                [Op.like]: '%' + data.keyword + '%',
              }
            } : null,
            data.category ? { category_id: data.category } : null,
          ]
        },
        order: data.sort ? [['price', data.sort]] : null,
        raw: true,
      });

      if (listProduct) {
        resolve({
          sucess: true,
          list_product: listProduct,
        })
      } else {
        resolve({
          sucess: false,
          message: 'There are currently no products!',
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getInfoProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productInfo = await db.Product.findOne({
        where: { id: productId },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        raw: true,
      })

      let size = await db.Size.findAll({
        attributes: [
          'size',
          [sequelize.fn('SUM', sequelize.col('sizeshoes.amount')), 'amount']
        ],
        include: [{
          model: db.SizeShoe,
          attributes: [],
          where: { product_id: productInfo.id },
        }],
        group: ['Size.id'],
        raw: true,
      })
      productInfo.size_info = size;

      if (productInfo) {
        resolve({
          success: true,
          product_info: productInfo,
        })
      } else {
        resolve({
          success: false,
          message: 'abc',
          // product_info: [],
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let addProductToCart = (productId, sizeId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sizeshoe = await db.SizeShoe.findOne({
        where: { product_id: productId, size_id: sizeId }
      })

      if (!sizeshoe) {
        resolve({
          success: false,
          message: 'Sản phẩm không tồn tại!',
        })
      }

      let cart = await db.Cart.findOne({
        where: { sizeshoe_id: sizeshoe.id, user_id: userId }
      });

      if (cart) {
        if (cart.amount < sizeshoe.amount) {
          cart.amount += 1;
          await cart.save();

          let productInfo = await db.Product.findOne({
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            where: { id: productId },
            raw: true,
          })
          let size = await db.Size.findOne({ attributes: ['size'], where: { id: sizeId } })
          productInfo.size = size.size
          productInfo.amount = cart.amount

          resolve({
            success: true,
            product_info: productInfo,
          })
        } else {
          resolve({
            success: false,
            message: 'Số lượng sản phẩm quá vượt quá giới hạn ...'
          })
        }
      } else {
        let cart = await db.Cart.create({
          user_id: userId,
          sizeshoe_id: sizeshoe.id,
          amount: 1,
          status: 1,
        })

        let product = await db.Product.findOne({
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          where: { id: productId },
          raw: true,
        });
        let size = await db.Size.findOne({ where: { id: sizeId }, attributes: ['size'] });
        product.size = size;
        product.amount = cart.amount;

        resolve({
          success: true,
          product_info: product,
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

// theo so luong san pham ban ra
let getRecommendedProduct = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Product.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{
          model: db.SizeShoe,
          include: [{
            model: db.OrderDetail,
            // require: true,
            attributes: []
          }],

          attributes: [
            [sequelize.fn('SUM', sequelize.col('SizeShoes.OrderDetails.amount')), 'total_sold']
          ]
        },
        {
          model: db.Product_Category,
          attributes: [],
          where: categoryId ? { 'category_id': categoryId } : null,
        }
        ],
        group: ['SizeShoes.product_id'],
        order: [[sequelize.literal('`SizeShoes.total_sold`'), 'DESC']],
      })
      resolve({
        success: true,
        data: data
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  getListProduct: getListProduct,
  getInfoProduct: getInfoProduct,
  addProductToCart: addProductToCart,
  getRecommendedProduct: getRecommendedProduct,
}
