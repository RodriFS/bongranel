export default {
  development: {
    dialect: "mysql",
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "pcscale",
    },
  },
  test: {
    dialect: "mysql",
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "test_pcscale",
    },
  },
  production: {
    dialect: "mysql",
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "prod_pcscale",
      username: process.env.LOCAL_USERNAME,
      password: process.env.LOCAL_PASSWORD,
    },
  },
};
