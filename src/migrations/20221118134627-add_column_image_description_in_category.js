'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Categories', 'image', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Categories', 'description', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Products', 'collection_id', {
          type: Sequelize.DataTypes.INTEGER
        }, { transaction: t }),
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Categories', 'image', { transaction: t }),
        queryInterface.removeColumn('Categories', 'description', { transaction: t }),
        queryInterface.removeColumn('Products', 'collection_id', { transaction: t }),
      ]);
    });
  }
};
