import { Totals } from "./db/models/remote/totals";
import { INTERVAL } from "./constants/config";
import { Tickets } from "./db/models/local/tickets";
import { readDateJson, writeDateJson } from "./utils/fileSystem";
import { getTotals } from "./utils/helpers";
import logger from "./utils/logger";

export const sync = async () => {
  const lastDate = readDateJson();
  const tickets = await Tickets.getLastTickets(lastDate);
  const totals = getTotals(tickets);

  logger.info(JSON.stringify(totals, null, 4));

  await Totals.substractFromTotals(totals);
  writeDateJson();
  logger.info(`Last connection: ${new Date()}`);
};

setInterval(sync, INTERVAL);
