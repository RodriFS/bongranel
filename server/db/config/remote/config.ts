const dialectModule = require("mysql2");

export default {
  development: {
    dialect: "mysql",
    dialectModule,
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "wordpress",
    },
  },
  test: {
    dialect: "mysql",
    dialectModule,
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "test_wordpress",
    },
  },
  production: {
    dialect: "mysql",
    dialectModule,
    logging: true,
    dialectOptions: {
      host: process.env.REMOTE_HOST_ADDRESS,
      user: process.env.REMOTE_USER,
      database: process.env.REMOTE_DATABASE,
      password: process.env.REMOTE_PASSWORD,
    },
  },
};
