import db from '../models/index';
const { Op } = require("sequelize");

let getListProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listProduct = await db.Product.findAll({
        attributes: ['name', 'image', 'price'],
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
          product_info: [],
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

let filter = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = []
      console.log(data.name)
      if (data.name) {
        let product = await db.Product.findAll({
          where: {
            name: {
              [Op.like]: '%A',
            }
          }
        })
        

        resolve({
          data: product
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  getListProduct: getListProduct,
  getInfoProduct: getInfoProduct,
  addProductToCart: addProductToCart,
  filter: filter,
}
