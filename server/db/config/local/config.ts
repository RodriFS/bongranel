const dialectModule = require("mysql2");

export default {
  development: {
    dialect: "mysql",
    dialectModule,
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "pcscale",
    },
  },
  test: {
    dialect: "mysql",
    dialectModule,
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "test_pcscale",
    },
  },
  production: {
    dialect: "mysql",
    dialectModule,
    logging: true,
    dialectOptions: {
      host: process.env.LOCAL_HOST_ADDRESS,
      user: process.env.LOCAL_USER,
      database: process.env.LOCAL_DATABASE,
      password: process.env.LOCAL_PASSWORD,
    },
  },
};
