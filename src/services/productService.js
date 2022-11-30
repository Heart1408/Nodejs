import db from '../models/index';
const { Op } = require("sequelize");
var sequelize = require('sequelize');

const limit = 12;

const getPagination = (pageNumber) => {
  const offset = (pageNumber - 1) * limit;
  return offset;
}

let getListProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offset = data.pageNumber ? getPagination(data.pageNumber) : 0;

      const { count, rows } = await db.Product.scope('defaultScope', { method: ['filter', data.keyword, data.maxPrice, data.minPrice, data.sortByPrice, data.collectionId] }).findAndCountAll({
        include: {
          model: db.Product_Category.scope({ method: ['filterProduct', data.categoryId, data.brandId] }),
          attributes: []
        },
        limit,
        offset,
        raw: true,
      });

      let totalItems = count;
      let totalPages = Math.ceil(totalItems / limit);
      let currentPage = data.pageNumber ? data.pageNumber : 1;

      if (rows) {
        resolve({
          sucess: true,
          list_product: rows,
          totalItems: totalItems,
          totalPages: totalPages,
          currentPage: currentPage,
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

let getRate = (productId, numberRate) => {
  return new Promise(async (resolve, reject) => {
    try {
      let rows = await db.SizeShoe.findAll({
        where: { product_id: productId },
        include: {
          model: db.OrderDetail,
          attributes: [],
          include: {
            model: db.Review,
            attributes: [],
            where: numberRate ? { rate: numberRate } : null
          },
        },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('`OrderDetails.review_id`')), 'result']
        ],
        raw: true,
      })

      resolve(rows[0].result)
    } catch (e) {
      reject(e)
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
          'id', 'size',
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

      let comment = await db.OrderDetail.findAll({
        attributes: [],
        include: [{
          model: db.SizeShoe,
          where: { product_id: productId },
          attributes: []
        }, {
          model: db.Review,
          attributes: ['rate', 'comment']
        }, {
          model: db.Order,
          attributes: ['id'],
          include: {
            model: db.Address,
            attributes: ['id', 'user_id'],
          }
        }]
      })

      let datas = []
      for (let i = 0; i < comment.length; i++) {
        let user = await getUser(comment[i].Order.Address.user_id)
        let data = {
          rate: comment[i].Review.rate,
          comment: comment[i].Review.comment,
          username: user[0],
          avatar: user[1]
        }
        datas.push(data)
      }

      productInfo.size_info = size;
      productInfo.total_rate = await getRate(productId, null)
      productInfo.rate1 = await getRate(productId, 1)
      productInfo.rate2 = await getRate(productId, 2)
      productInfo.rate3 = await getRate(productId, 3)
      productInfo.rate4 = await getRate(productId, 4)
      productInfo.rate5 = await getRate(productId, 5)
      productInfo.comments = datas

      if (productInfo) {
        resolve({
          success: true,
          product_info: productInfo,
        })
      } else {
        resolve({
          success: false,
          message: 'abc',
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        attributes: ['username', 'avatar'],
        where: { id: userId }
      })

      resolve([user.username,
      user.avatar]
      )
    } catch (e) {
      reject(e)
    }
  })
}

let addProductToCart = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findByPk(data.productId);
      if (!product) {
        resolve({
          success: false,
          message: 'Sản phẩm không tồn tại!',
        })
      }

      let sizeshoe = await db.SizeShoe.findOne({
        where: { product_id: data.productId, size_id: data.sizeId },
        // raw: true
      })

      if (!sizeshoe) {
        resolve({
          success: false,
          message: 'Sản phẩm đã hết size.',
        })
      }

      let category = await db.Category.findOne({
        attributes: ['id'],
        include: {
          model: db.Product_Category,
          where: { product_id: data.productId },
          attributes: []
        },
        raw: true,
      })

      let brand = await db.Brand.findOne({
        attributes: ['id'],
        include: {
          model: db.Product_Category,
          where: { product_id: data.productId },
          attributes: []
        },
        raw: true,
      })

      let cart = await db.Cart.findOne({
        where: { sizeshoe_id: sizeshoe.id, user_id: userId }
      });

      if (cart) {
        let total_amount = parseInt(cart.amount) + parseInt(data.amount)
        if (total_amount <= sizeshoe.amount) {
          cart.amount = total_amount;
          await cart.save();

          let productInfo = await db.Product.findOne({
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            where: { id: data.productId },
            raw: true,
          })
          let size = await db.Size.findOne({ attributes: ['size'], where: { id: data.sizeId } })
          productInfo.category_id = category ? category.id : null
          productInfo.brand_id = brand ? brand.id : null
          productInfo.size = size.size
          productInfo.sizeId = data.sizeId
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
        if (data.amount <= sizeshoe.amount) {
          let cart = await db.Cart.create({
            user_id: userId,
            sizeshoe_id: sizeshoe.id,
            amount: data.amount
          })

          let product = await db.Product.findOne({
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            where: { id: data.productId },
            raw: true,
          });
          let size = await db.Size.findOne({ where: { id: data.sizeId }, attributes: ['size'] });
          product.category_id = category ? category.id : null
          product.brand_id = brand ? brand.id : null
          product.sizeId = data.sizeId
          product.size = size;
          product.amount = cart.amount;

          resolve({
            success: true,
            product_info: product,
          })
        } else {
          resolve({
            success: false,
            message: 'Số lượng sản phẩm quá vượt quá giới hạn ...'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

// theo so luong san pham ban ra
let getRecommendedProduct = (categoryId, brandId, pageNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offset = pageNumber ? getPagination(pageNumber) : 0;

      const { count, rows } = await db.Product.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{
          model: db.Product_Category.scope({ method: ['filterProduct', categoryId, brandId] }),
          attributes: ['category_id', 'brand_id']
        },
          // {
          //   model: db.SizeShoe,
          //   include: [{
          //     model: db.OrderDetail,
          //     attributes: []
          //   }],
          // attributes: [
          //   [sequelize.fn('SUM', sequelize.col('SizeShoes.OrderDetails.amount')), 'total_sold']
          // ]
          // }
        ],
        // group: ['SizeShoes.product_id'],
        // order: [[sequelize.literal('`SizeShoes.total_sold`'), 'DESC']],
        limit,
        offset
      })

      let totalItems = count;
      let totalPages = Math.ceil(totalItems / limit);
      let currentPage = pageNumber ? pageNumber : 1;

      resolve({
        success: true,
        data: rows,
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: currentPage
      })
    } catch (e) {
      reject(e)
    }
  })
}

let getListSize = (categoryId, brandId, pageNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Size.findAll({
        attributes: ['id', 'size']
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
  getListSize: getListSize
}
