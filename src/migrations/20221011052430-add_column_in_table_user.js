'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Users', 'username', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'password', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'phone', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'avatar', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'birthday', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'gender', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Users', 'username', { transaction: t }),
        queryInterface.removeColumn('Users', 'password', { transaction: t }),
        queryInterface.removeColumn('Users', 'phone', { transaction: t }),
        queryInterface.removeColumn('Users', 'avatar', { transaction: t }),
        queryInterface.removeColumn('Users', 'birthday', { transaction: t }),
        queryInterface.removeColumn('Users', 'gender', { transaction: t })
      ]);
    });
  }
};
