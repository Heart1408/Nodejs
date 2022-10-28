'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Sizes', [{
      size: 36,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      size: 37,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      size: 38,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      size: 39,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
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
