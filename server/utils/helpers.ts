import { Tickets, Units } from "../db/models/local/tickets";

export const fixNumber = (num: number) => {
  return Math.round(num * 1000) / 1000;
};

export const getTotals = (tickets: Tickets[]) => {
  return tickets.reduce(
    (totals, ticket) => {
      const units = ticket.SaleForm === Units.GRAMS ? "grams" : "units";
      totals[units][ticket.productId] = fixNumber((totals[ticket.productId] ?? 0) + ticket.amountSold);
      return totals;
    },
    {
      units: {},
      grams: {},
    } as { [key in "units" | "grams"]: Record<string, number> }
  );
};
