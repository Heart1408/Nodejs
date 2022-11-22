'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let size = []
    for (let i = 0; i < 34; i++) {
      size.push({
        size_id: 1,
        product_id: i,
        amount: Math.floor(Math.random() * 30),
        createdAt: new Date(),
        updatedAt: new Date()
      },  {
        size_id: 2,
        product_id: i,
        amount: Math.floor(Math.random() * 30),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        size_id: 3,
        product_id: i,
        amount: Math.floor(Math.random() * 30),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        size_id: 4,
        product_id: i,
        amount: Math.floor(Math.random() * 30),
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
