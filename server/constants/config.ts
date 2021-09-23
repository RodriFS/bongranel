import path from "path";

export const PWD = path.join(__dirname, "..", "..");
export const ENVIRONMENT = process.env.NODE_ENV ?? "development";
export const DEBUG_MODE = process.env.DEBUG_MODE ?? "warn";
export const SERVER_PORT = process.env.SERVER_PORT ?? 8081;
export const DEBUG_DB = process.env.DEBUG_DB === "true";
export const INTERVAL = parseInt(process.env.INTERVAL ?? "30000");
