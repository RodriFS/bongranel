import { Tickets } from "../db/models/local/tickets";

export const reduceAllTime = (tickets: Tickets[]) => {
  return tickets.reduce(
    (acc, ticket) => {
      if (ticket.Amount === null) {
        return acc;
      }
      if (!acc[ticket.units][ticket.Name]) {
        acc[ticket.units][ticket.Name] = 0;
      }
      acc[ticket.units][ticket.Name] += parseFloat(ticket.Amount);
      return acc;
    },
    {
      GRAMS: {},
      UNIT: {},
    } as Record<string, Record<string, number>>
  );
};

const reduceOthers = (
  array: {
    label: string;
    value: number;
  }[]
) =>
  array.reduce((acc, units) => ({ ...acc, value: acc.value + (units.value ?? 0) }), {
    label: "OTROS",
    value: 0,
  });

export const getData = (totals: Record<string, Record<string, number>>) => {
  const units = Object.entries(totals["UNIT"])
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const grams = Object.entries(totals["GRAMS"])
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const mostSoldUnits = units.slice(0, 5);
  const restMostSoldUnits = units.slice(5);
  const lessSoldUnits = units.slice(units.length - 5, units.length);
  const restLessSoldUnits = units.slice(0, units.length - 5);

  const mostSoldGrams = grams.slice(0, 5);
  const restMostSoldGrams = grams.slice(5);
  const lessSoldGrams = grams.slice(grams.length - 5, grams.length);
  const restLessSoldGrams = grams.slice(0, grams.length - 5);

  return {
    mostSold: {
      units: [...mostSoldUnits, reduceOthers(restMostSoldUnits)],
      grams: [...mostSoldGrams, reduceOthers(restMostSoldGrams)],
    },
    lessSold: {
      units: [...lessSoldUnits, reduceOthers(restLessSoldUnits)],
      grams: [...lessSoldGrams, reduceOthers(restLessSoldGrams)],
    },
  };
};
