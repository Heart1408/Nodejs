import bodyParser from 'body-parser';
import db from '../models/index';
const { Op } = require("sequelize");
var sequelize = require('sequelize');

const limit = 2;

const getPagination = (pageNumber) => {
  const offset = (pageNumber - 1) * limit;
  return offset;
}

let getListProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offset = data.pageNumber ? getPagination(data.pageNumber) : 0;

      const { count, rows } = await db.Product.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: {
          model: db.Product_Category,
          attributes: [],
          where: {
            [Op.and]: [
              data.categoryId ? { 'category_id': data.categoryId } : null,
              data.brandId ? { 'brand_id': data.brandId } : null
            ]
          }
        },
        where: {
          [Op.and]: [
            data.keyword ? {
              name: {
                [Op.like]: '%' + data.keyword + '%',
              }
            } : null,
            data.minPrice ? { price: { [Op.gte]: data.minPrice } } : null,
            data.maxPrice ? { price: { [Op.lte]: data.maxPrice } } : null,
          ]
        },
        order: data.sortByPrice ? [['price', data.sortByPrice]] : null,
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
      let product = await db.Product.findByPk(productId);
      if (!product) {
        resolve({
          success: false,
          message: 'Sản phẩm không tồn tại!',
        })
      }

      let sizeshoe = await db.SizeShoe.findOne({
        where: { product_id: productId, size_id: sizeId }
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
          where: { product_id: productId },
          attributes: []
        },
        raw: true,
      })

      let brand = await db.Brand.findOne({
        attributes: ['id'],
        include: {
          model: db.Product_Category,
          where: { product_id: productId },
          attributes: []
        },
        raw: true,
      })

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
          productInfo.category_id = category.id
          productInfo.brand_id = brand.id
          productInfo.size = size.size
          productInfo.sizeId = sizeId
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
        product.category_id = category.id
        product.brand_id = brand.id
        product.sizeId = sizeId
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
let getRecommendedProduct = (categoryId, brandId, pageNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offset = pageNumber ? getPagination(pageNumber) : 0;

      const { count, rows } = await db.Product.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{
          model: db.Product_Category,
          attributes: ['category_id', 'brand_id'],
          where: {
            [Op.and]: [
              categoryId ? { category_id: categoryId } : null,
              brandId ? { brand_id: brandId } : null
            ]
          }
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

module.exports = {
  getListProduct: getListProduct,
  getInfoProduct: getInfoProduct,
  addProductToCart: addProductToCart,
  getRecommendedProduct: getRecommendedProduct,
}
