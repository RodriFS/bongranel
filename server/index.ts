import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { SERVER_PORT } from "./constants/config";
import logger from "./utils/logger";
import router from "./routes";
import path from "path";

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

app.use("/", router);

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(SERVER_PORT, () => {
  logger.info(`App listening at http://localhost:${SERVER_PORT}`);
});

process.on("uncaughtException", (error: Error) => logger.error(error.message));
process.on("unhandledRejection", (error: Error) => logger.error(error.message));
