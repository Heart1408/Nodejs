'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let products = []
    for (let i = 0; i< 50; i++) {
      products.push({
        product_id: Math.floor(Math.random() * 30 + 1),
        category_id: Math.floor(Math.random() * 7 + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    return queryInterface.bulkInsert('Product_Categories', products)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
