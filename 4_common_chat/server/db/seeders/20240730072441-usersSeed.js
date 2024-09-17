const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Users', [
      {
        name: 'user',
        email: 'user@user.ru',
        password: await bcrypt.hash('123', 10)
      },
      {
        name: 'user1',
        email: 'use1r@user.ru',
        password: await bcrypt.hash('123', 10)
      },
      {
        name: 'user2',
        email: 'user2@user.ru',
        password: await bcrypt.hash('123', 10)
      },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
