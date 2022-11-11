import bodyParser from 'body-parser';
import db from '../../models/index';
const { Op } = require("sequelize");
var sequelize = require('sequelize');

let createProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newProduct = await db.Product.create({
        name: data.name,
        price: data.price,
        image: data.image,
        description: data.description,
      });

      let t = await db.Product_Category.create({
        product_id: newProduct.id,
        category_id: data.categoryId,
      });

      let productSize = [];
      if (data.sizes) {
        for (let i = 0; i < data.sizes.length; i++) {
          let record = {
            product_id: newProduct.id,
            size_id: data.sizes[i].size_id,
            amount: data.sizes[i].amount
          }
          productSize.push(record);
        }
      }
      await db.SizeShoe.bulkCreate(productSize);

      resolve({
        success: true,
        message: "abc",
      })
    } catch (e) {
      reject(e)
    }
  })
}

let updateProduct = (productId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findByPk(productId);
      if (!product) {
        resolve({
          success: false,
          message: 'No products found!'
        })
      }

      product.name = data.name;
      product.description = data.description;
      product.image = data.image;
      product.price = data.price;
      await product.save();

      if (data.categoryId) {
        let productCategory = await db.Product_Category.findOne({
          include: {
            model: db.Category,
            attributes: [],
            where: { 'type': 1 },
          },
          where: { product_id: product.id },
        });

        if (productCategory) {
          productCategory.category_id = data.categoryId;
          await productCategory.save();
        } else {
          await db.Product_Category.create({
            type: 1,
            category_id: data.categoryId,
            product_id: product.id
          })
        }
      }

      if (data.sizes) {
        for (let i = 0; i < data.sizes.length; i++) {
          let size_id = data.sizes[i].size_id;
          let amount = data.sizes[i].amount;
          let sizeShoe = await db.SizeShoe.findOne({ where: { size_id: size_id, product_id: product.id } });

          if (sizeShoe) {
            sizeShoe.amount = amount;
            await sizeShoe.save();
          } else {
            await db.SizeShoe.create({
              amount: amount,
              size_id: size_id,
              product_id: product.id
            })
          }
        }
      }

      resolve({
        success: true,
        message: 'Update susscess!',
      })
    } catch (e) {
      reject(e)
    }
  })
}

let deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findByPk(productId);
      if (!product) {
        resolve({
          success: false,
          message: 'No products found!'
        })
      };

      await db.Product.destroy({
        where: {
          id: productId
        }
      });

      resolve({
        success: true,
        message: 'Delete succeed!'
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  createProduct: createProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
}
