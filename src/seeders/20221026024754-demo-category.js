'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [{
      name: "Man",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Woman",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Kids",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Sports",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Abc",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Converse",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Adidas",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Nike",
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
