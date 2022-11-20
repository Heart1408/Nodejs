'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('Admins', 'refresh_token', {
                    type: Sequelize.DataTypes.TEXT
                }, { transaction: t }),
            ]);
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Admins', 'refresh_token', { transaction: t }),
            ]);
        });
    }
};
