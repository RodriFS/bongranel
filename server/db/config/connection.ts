import { Sequelize, Options } from "sequelize";
import logger from "../../utils/logger";
import { ENVIRONMENT, DEBUG_DB } from "../../constants/config";
import localConfigJson from "./local/config";
import remoteConfigJson from "./remote/config";

interface DBConfig {
  [env: string]: Options;
}

const logging = (sql: string) => {
  if (DEBUG_DB) {
    logger.debug(sql);
  }
};

const dbConfigLocal = (localConfigJson as DBConfig)[ENVIRONMENT];
const dbConfigRemote = (remoteConfigJson as DBConfig)[ENVIRONMENT];

dbConfigLocal.logQueryParameters = false;
dbConfigRemote.logQueryParameters = false;
dbConfigLocal.logging = logging;
dbConfigRemote.logging = logging;

export const localDatabase = new Sequelize(dbConfigLocal);
export const remoteDatabase = new Sequelize(dbConfigRemote);

localDatabase
  .authenticate()
  .then(() => {
    logger.info("Connection to local database has been established successfully.");
  })
  .catch((error: any) => {
    logger.info("Unable to connect to the local database: ", error);
  });

remoteDatabase
  .authenticate()
  .then(() => {
    logger.info("Connection to remote database has been established successfully.");
  })
  .catch((error: any) => {
    logger.info("Unable to connect to the remote database: ", error);
  });
