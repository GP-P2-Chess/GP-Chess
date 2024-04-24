"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalWin: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalPlay: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      mmr: {
        type: Sequelize.INTEGER,
        defaultValue: 1000,
      },
      profilePicture: {
        type: Sequelize.STRING,
        defaultValue: "https://avatar.iran.liara.run/public/39",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
