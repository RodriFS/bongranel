import path from "path";

export const PWD = path.join(__dirname, "..", "..");
export const ENVIRONMENT = process.env.NODE_ENV ?? "development";
export const DEBUG_MODE = process.env.DEBUG_MODE ?? "warn";
export const PORT = process.env.PORT ?? 3000;
export const DEBUG_DB = process.env.DEBUG_DB ?? false;
export const INTERVAL = parseInt(process.env.INTERVAL ?? "30000");
