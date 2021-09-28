import { Tickets, Units } from "../db/models/local/tickets";

export const fixNumber = (num: number) => {
  return Math.round(num * 1000) / 1000;
};

export const getTotals = (tickets: Tickets[]) => {
  return tickets.reduce(
    (totals, ticket) => {
      const units = ticket.SaleForm === Units.GRAMS ? "grams" : "unit";
      totals[units][ticket.productId] = fixNumber((totals[units][ticket.productId] ?? 0) + ticket.amountSold);
      return totals;
    },
    {
      unit: {},
      grams: {},
    } as { [key in "unit" | "grams"]: Record<string, number> }
  );
};
