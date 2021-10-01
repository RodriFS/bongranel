import { PostMeta } from "./db/models/remote/wpdn_postmeta";
import { INTERVAL } from "./constants/config";
import { Tickets } from "./db/models/local/tickets";
import { readDateJson, writeDateJson } from "./utils/fileSystem";
import { getTotals } from "./utils/helpers";
import logger from "./utils/logger";

export const sync = async () => {
  const lastDate = readDateJson();
  const newDate = new Date();
  const tickets = await Tickets.getLastTickets(lastDate, newDate);
  const totals = getTotals(tickets);

  tickets?.length && logger.info(JSON.stringify(totals, null, 4));

  await PostMeta.substractFromTotals(totals.grams, "grams");
  await PostMeta.substractFromTotals(totals.unit, "unit");
  writeDateJson(newDate);
  logger.info(`Last connection: ${newDate}`);
};

setInterval(sync, INTERVAL);
