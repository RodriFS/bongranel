import type { Tickets } from "../db/models/local/tickets";

export const fixNumber = (num: number) => {
  return Math.round(num * 1000) / 1000;
};

export const getTotals = (tickets: Tickets[]) => {
  return tickets.reduce((totals, ticket) => {
    totals[ticket.productId] = fixNumber((totals[ticket.productId] ?? 0) + ticket.amountSold);
    return totals;
  }, {} as Record<string, number>);
};
