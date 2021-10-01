import fs from "fs";
import path from "path";
import { PWD } from "../constants/config";
import logger from "./logger";

export const checkDirectory = (location: string[]) => {
  let buildPath = "";
  for (const dir of location) {
    const directory = path.join(buildPath, dir);
    const exists = fs.existsSync(directory);
    if (!exists) {
      fs.mkdirSync(directory);
    }
    buildPath = directory;
  }
};

export const readDateJson = () => {
  try {
    const stringDate = fs.readFileSync(path.join(PWD, "lastConnection.json"));
    return new Date(stringDate.toString());
  } catch (err) {
    logger.warn("No date found for last connection, default to now");
    return new Date();
  }
};

export const writeDateJson = (date: Date) => {
  try {
    fs.writeFileSync(path.join(PWD, "lastConnection.json"), date.toString());
  } catch (err) {
    logger.warn(err);
  }
};
