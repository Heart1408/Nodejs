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

let getListProduct = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cart = await db.Cart.findAll({
        where: { user_id: userId },
        attributes: ['id', 'amount'],
        include: {
          model: db.SizeShoe,
          attributes: ['id'],
          include: [{
            model: db.Size,
            attributes: ['id','size'],
          }, {
            model: db.Product,
            attributes: ['id' ,'image', 'name', 'price']
          }]
        },
        raw: true,
      })

      console.log(cart)

      let carts = []
      for (let i = 0; i < cart.length; i++) {
        let record = {
          id: cart[i].id,
          name: cart[i]['SizeShoe.Product.name'],
          image: cart[i]['SizeShoe.Product.image'],
          size_id: cart[i]['SizeShoe.Size.id'],
          size: cart[i]['SizeShoe.Size.size'],
          price: cart[i]['SizeShoe.Product.price'],
          product_id: cart[i]['SizeShoe.Product.id'],
          amount: cart[i].amount
        }

        carts.push(record)
      }

      resolve({
        success: true,
        carts: carts
      })
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  deleteProduct: deleteProduct,
  changeAmount: changeAmount,
  getListProduct: getListProduct
}
