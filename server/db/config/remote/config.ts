export default {
  development: {
    dialect: "mysql",
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "wordpress",
    },
  },
  test: {
    dialect: "mysql",
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "test_wordpress",
    },
  },
  production: {
    dialect: "mysql",
    logging: true,
    dialectOptions: {
      host: "localhost",
      user: "root",
      database: "prod_wordpress",
      username: process.env.REMOTE_USERNAME,
      password: process.env.REMOTE_PASSWORD,
    },
  },
};
