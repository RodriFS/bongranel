"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((_) => {
      return queryInterface.createTable("totals", {
        Id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        ProductId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        Name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        Total: {
          allowNull: false,
          type: Sequelize.FLOAT,
        },
        Limit: {
          allowNull: false,
          type: Sequelize.FLOAT,
        },
      });
    });
  },
  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(() => {
      return queryInterface.dropTable("totals");
    });
  },
};
