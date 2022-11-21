'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const bcrypt = require('bcrypt');
        let hashPasswordFromBcrypt = await bcrypt.hashSync('12345', bcrypt.genSaltSync(10))
        return queryInterface.bulkInsert('Admins', [{
            username: 'admin',
            password: hashPasswordFromBcrypt,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
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
