"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Chats",
      [
        {
          fromId: 1,
          toId: 2,
          message: "Hello",
        },
        {
          fromId: 2,
          toId: 1,
          message: "Hi",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Chats", null, {});
  },
};
