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
            data.name ? {
              name: {
                [Op.like]: '%' + data.name + '%',
              }
            } : null,
            data.category ? { category_id: data.category } : null,
          ]
        },
        order: data.price ? [['price', data.price]] : null,
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
        raw: true
      })

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

let addProductToCart = (productId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findOne({
        where: {id: productId}
      })

      if (!product) {
        resolve({
          success: false,
          message: 'Sản phẩm không tồn tại!',
        })
      }

      let cart = await db.Cart.findOne({
        where: { product_id: productId, user_id: userId }
      });

      let remainingStock = await db.Product.findOne({
        attributes: ['amount'],
        where: { id: productId }
      })

      if (cart) {
        if (cart.amount < remainingStock.amount) {
          cart.amount += 1;
          await cart.save();

          resolve({
            success: true,
            product_id: productId,
          })
        } else {
          resolve({
            success: false,
            message: 'Số lượng sản phẩm quá vượt quá giới hạn ...'
          })
        }
      } else {
        await db.Cart.create({
          user_id: userId,
          product_id: productId,
          amount: 1,
          status: 1,
        })

        resolve({
          success: true,
          product_id: productId,
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
      // let data = await db.Category.findOne({
      //   where: {
      //     id: categoryId
      //   },
      //   attributes:  ['id', 'name'],
      //   include: [
      //     { model: db.Product, as: 'categoryData' }
      //   ]
      // })

      let data = await db.Product.findAll({
        attributes: [
          'id',
          'name',
          'description',
          'image',
          'price',
          [sequelize.fn('SUM', sequelize.col('OrderDetails.amount')), 'total_sold']
        ],
        include: [{
          model: db.OrderDetail,
          // require: true,
          attributes: []
        }],
        where: categoryId ? { category_id: categoryId } : null,
        group: ['Product.id'],
        order: [['total_sold', 'DESC']],
        raw: true,
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
