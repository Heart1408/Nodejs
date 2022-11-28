import db from '../models/index';
const { Op } = require("sequelize");
var sequelize = require('sequelize');

let getList = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await db.OrderDetail.findOne({
        attributes: ['review_id'],
        include: {
          model: db.SizeShoe,
          where: { product_id: productId }
        }
      })
      if (!check) {
        resolve({
          success: false,
          message: 'Không có lượt review nào!',
        })
      }
      let list = await db.Review.findAll({
        attributes: {
          exclude: ['createdAt']
        },
        include: {
          model: db.OrderDetail,
          attributes: [],
          include: {
            model: db.SizeShoe,
            attributes: [],
            where: { product_id: productId },
          }
        }
      });

      resolve({
        success: true,
        list: list,
      })
    } catch (e) {
      reject(e);
    }
  })
}

let create = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderDetail = await db.OrderDetail.findOne({
        attributes: ['id', 'review_id'],
        include: [{
          model: db.SizeShoe,
          where: { product_id: data.productId }
        }, {
          model: db.Order,
          where: { status: 4 },
          include: {
            model: db.Address,
            where: { user_id: userId }
          }
        }]
      })
      if (!orderDetail) {
        resolve({
          success: false,
          message: 'Chưa thể đánh giá sảm phẩm!'
        })
      } else if (orderDetail.review_id != null) {
        resolve({
          success: false,
          message: 'Bạn đã đánh giá sản phẩm!'
        })
      } else {
        if (data.rate < 1 || data.rate > 5) {
          resolve({
            success: false,
            message: 'Rate không hợp lệ!'
          })
        } else {
          let newReview = await db.Review.create({
            rate: data.rate,
            comment: data.comment
          })
          orderDetail.review_id = newReview.id
          await orderDetail.save()

          resolve({
            success: true,
            message: 'Success!'
          })
        }
      }
    } catch (e) {
      reject(e);
    }
  })
}

let edit = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderDetail = await db.OrderDetail.findOne({
        attributes: ['review_id'],
        include: [{
          model: db.SizeShoe,
          where: { product_id: data.productId }
        }, {
          model: db.Order,
          where: { status: 4 },
          include: {
            model: db.Address,
            where: { user_id: userId }
          }
        }]
      })
      if (!orderDetail || orderDetail.review_id == null) {
        resolve({
          success: false,
          message: 'Fail!'
        })
      } else {
        let review = await db.Review.findByPk(orderDetail.review_id)

        if (data.rate < 1 || data.rate > 5) {
          resolve({
            success: false,
            message: 'Rate không hợp lệ!'
          })
        } else review.rate = data.rate
        review.comment = data.comment
        review.save()

        resolve({
          success: true,
          message: 'Success!'
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let deleteReview = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderDetail = await db.OrderDetail.findOne({
        attributes: ['id', 'review_id'],
        include: [{
          model: db.SizeShoe,
          where: { product_id: productId }
        }, {
          model: db.Order,
          where: { status: 4 },
          include: {
            model: db.Address,
            where: { user_id: userId }
          }
        }]
      })
      if (!orderDetail || orderDetail.review_id == null) {
        resolve({
          success: false,
          message: 'Fail!'
        })
      } else {
        await db.Review.destroy({
          where: {
            id: orderDetail.review_id
          }
        })


        orderDetail.review_id = null
        await orderDetail.save()

        resolve({
          success: true,
          message: 'Success!'
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  getList: getList,
  create: create,
  edit: edit,
  deleteReview: deleteReview
}
