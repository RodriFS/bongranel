import winston from "winston";
import cluster from "cluster";
import path from "path";
import { PWD, DEBUG_MODE, ENVIRONMENT } from "../constants/config";
import { checkDirectory } from "../utils/fileSystem";

checkDirectory([PWD, "logs"]);

const format = winston.format.printf(({ level, message }) => {
  return JSON.stringify({ timestamp: new Date(), message, level });
});

let infoFile;
let exceptionsFile;
const now = new Date().toDateString();
if (cluster.isMaster) {
  infoFile = new winston.transports.File({
    filename: path.join(PWD, "logs", `${now}_log_master.log`),
    level: "debug",
    format,
    maxsize: 1024 * 100,
  });
  exceptionsFile = new winston.transports.File({
    filename: path.join(PWD, "logs", `${now}_exceptions_master.log`),
    level: "info",
    format,
    maxsize: 1024 * 100,
  });
} else {
  const processId = process.pid;
  infoFile = new winston.transports.File({
    filename: path.join(PWD, "logs", `${now}_log_pid_${processId}.log`),
    level: "debug",
    format,
    maxsize: 1024 * 100,
  });
  exceptionsFile = new winston.transports.File({
    filename: path.join(PWD, "logs", `${now}_exceptions_pid_${processId}.log`),
    level: "error",
    format,
    maxsize: 1024 * 100,
  });
}
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    winston.format.json()
  ),
  defaultMeta: { service: "user-service" },
  transports: [infoFile],
  exceptionHandlers: [exceptionsFile],
  exitOnError: false,
  silent: ENVIRONMENT === "test",
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    level: DEBUG_MODE ?? "warn",
  })
);

export default logger;
