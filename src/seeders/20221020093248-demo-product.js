'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const json = fs.readFileSync(__dirname + '/../json/shoes.json');
    const data = JSON.parse(json);
    let products = [];
    data.forEach(element => {
      products.push({
        name: element.name,
        description: "Giày chất lượng cao, bảo hành đổi trả 1 tháng",
        image: element.imageURL,
        price: element.price,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    });
    await queryInterface.bulkInsert('Products', products);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
