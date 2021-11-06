const dialectModule = require("mysql2");
const { getLocalTimezone } = require("../../../utils/timezone");

const timezone = getLocalTimezone();
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
    timezone,
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
    timezone,
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
    timezone,
  },
};
