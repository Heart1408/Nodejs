import db from '../models/index';
const { Op } = require("sequelize");
var sequelize = require('sequelize');

let deleteProduct = (productId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cart = await db.Cart.findAll({
        where: { user_id: userId },
        include: {
          model: db.SizeShoe,
          where: { product_id: productId }
        }
      })

      if (cart == '') {
        resolve({
          success: false,
          message: 'No products found!'
        })
      }

      for (let i = 0; i < cart.length; i++) {
        await db.Cart.destroy({
          where: { id: cart[i].id }
        });
      }

      resolve({
        success: true,
        message: 'Delete succeed!'
      })
    } catch (e) {
      reject(e);
    }
  })
}

let changeAmount = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cart = await db.Cart.findOne({
        where: { user_id: userId },
        include: {
          model: db.SizeShoe,
          where: { product_id: data.productId, size_id: data.sizeId }
        }
      })
      if (!cart) {
        resolve({
          success: false,
          message: 'Không tìm thấy sản phẩm!'
        })
      }

      let sizeshoe = await db.SizeShoe.findOne({
        where: { product_id: data.productId, size_id: data.sizeId },
      })

      if (sizeshoe.amount < 1) {
        resolve({
          success: false,
          message: 'Sản phẩm đã hết size.',
        })
      }

      if (data.amount < 1) {
        resolve({
          success: false,
          message: 'Số lượng không hợp lệ.'
        })
      } else if (data.amount > sizeshoe.amount) {
        resolve({
          success: false,
          message: 'Số lượng sản phẩm quá đã giới hạn.'
        })
      }

      cart.amount = data.amount;
      cart.save();

      resolve({
        success: true,
        message: 'Update succeed!'
      })
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  deleteProduct: deleteProduct,
  changeAmount: changeAmount,
}
