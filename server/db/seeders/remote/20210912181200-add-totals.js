"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      "totals",
      [
        {
          ProductId: 1,
          Name: "LLENTIA CASTELLANA",
          Total: 5000.0,
          Limit: 500.0,
        },
        {
          ProductId: 2,
          Name: "LLENTIA PARDINA ESPECIAL",
          Total: 5000.0,
          Limit: 500.0,
        },
        {
          ProductId: 3,
          Name: "LLENTIA VERDINA",
          Total: 5000.0,
          Limit: 500.0,
        },
        {
          ProductId: 4,
          Name: "LLENTIA CAVIAR",
          Total: 5000.0,
          Limit: 500.0,
        },
        {
          ProductId: 5,
          Name: "LLENTIA PARDINA ECO",
          Total: 5000.0,
          Limit: 500.0,
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("totals", {});
  },
};
