import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PORT } from "./constants/config";
import logger from "./utils/logger";
const app = express();
import "./daemon";
import { readDateJson } from "./utils/fileSystem";
import { sync } from "./daemon";

app.use(express.json());
app.use(express.static("public"));
app.get("/lastconnection", (_req, res) => {
  const lastConnection = readDateJson();
  res.send({ lastConnection });
});

app.get("/sync", async (_req, res) => {
  await sync();
  const lastConnection = readDateJson();
  res.send({ lastConnection });
});

app.listen(PORT, () => {
  logger.info(`App listening at http://localhost:${PORT}`);
});

process.on("uncaughtException", (error: Error) => logger.error(error.message));
process.on("unhandledRejection", (error: Error) => logger.error(error.message));
