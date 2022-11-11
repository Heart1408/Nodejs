import bodyParser from 'body-parser';
import db from '../models/index';
const { Op } = require("sequelize");
var sequelize = require('sequelize');

let getListCategory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let listCategory = await db.Category.findAll({
        attributes: ['id', 'name', 'type'],
        raw: true,
      });

      resolve({
        success: true,
        list: listCategory,
      })
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  getListCategory: getListCategory,
}
