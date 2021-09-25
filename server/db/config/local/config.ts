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
    timezone: "+02:00",
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
    timezone: "+02:00",
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
    timezone: "+02:00",
  },
};
