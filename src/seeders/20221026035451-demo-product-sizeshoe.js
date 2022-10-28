'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let size = []
    for (let i = 0; i < 30; i++) {
      size.push({
        size_id: Math.floor(Math.random() * 3 + 1),
        product_id: Math.floor(Math.random() * 30 + 1),
        amount: Math.floor(Math.random() * 30 + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    return queryInterface.bulkInsert('SizeShoes', size);
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
