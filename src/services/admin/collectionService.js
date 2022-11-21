import db from '../../models/index';
const { Op } = require("sequelize");
var sequelize = require('sequelize');

let getList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let list = await db.Collection.findAll({
        order: [['id', 'DESC']],
        limit: 3
      });

      resolve({
        success: true,
        collection: list
      })
    } catch (e) {
      reject(e);
    }
  })
}

let create = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newCollection = await db.Collection.create({
        name: data.name,
        image: data.image,
        description: data.description,
      });

      let listProduct = data.listProduct
      if (listProduct.length < 1) {
        resolve({
          success: true,
          message: 'Chưa có sản phẩm nào trong bộ sưu tập.'
        })
      }

      let listProductSuccess = []
      for (let i = 0; i < listProduct.length; i++) {
        let product = await db.Product.findByPk(listProduct[i])
        if (product) {
          if (product.collection_id == '') {
            product.collection_id = newCollection.id
            listProductSuccess.push(listProduct[i])
          }
          product.save()
        }
      }

      resolve({
        success: true,
        listProductSuccess: listProductSuccess
      })
    } catch (e) {
      reject(e);
    }
  })
}

let deleteCollection = (collectionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let collection = await db.Collection.findByPk(collectionId);
      if (!collection) {
        resolve({
          success: false,
          message: 'No collections found!'
        })
      };

      await db.Collection.destroy({
        where: { id: collectionId }
      });

      resolve({
        success: true,
        message: 'Delete succeed!'
      })
    } catch (e) {
      reject(e);
    }
  })
}

let update = (collectionId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let collection = await db.Collection.findByPk(collectionId)
      if (!collection) {
        resolve({
          success: true,
          message: 'collection not found!'
        })
      }
      collection.name = data.name
      collection.image = data.image
      collection.description = data.description
      collection.save()

      resolve({
        success: true,
        message: "update success!"
      })
    } catch (e) {
      reject(e);
    }
  })
}

let getProduct = (collectionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findAll({
        attributes: ['id'],
        where: { collection_id: collectionId }
      })

      resolve({
        success: true,
        listProduct: product
      })
    } catch (e) {
      reject(e);
    }
  })
}

let deleteProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let listProductSuccess = []
      for (let i = 0; i < data.listProduct.length; i++) {
        let product = await db.Product.findByPk(data.listProduct[i])
        if (product) {
          if (product.collection_id == data.collectionId) {
            product.collection_id = ''
            listProductSuccess.push(data.listProduct[i])
          }
          product.save()
        }
      }

      resolve({
        success: true,
        listProductSuccess: listProductSuccess
      })
    } catch (e) {
      reject(e);
    }
  })
}

let addProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let listProductSuccess = []
      for (let i = 0; i < data.listProduct.length; i++) {
        let product = await db.Product.findByPk(data.listProduct[i])
        if (product) {
          if (product.collection_id == '') {
            product.collection_id = data.collectionId
            listProductSuccess.push(data.listProduct[i])
          }
          product.save()
        }
      }

      resolve({
        success: true,
        listProductSuccess: listProductSuccess
      })
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  getList: getList,
  create: create,
  update: update,
  deleteCollection: deleteCollection,
  getProduct: getProduct,
  deleteProduct: deleteProduct,
  addProduct: addProduct,
}
