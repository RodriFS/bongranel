import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { SERVER_PORT } from "./constants/config";
import logger from "./utils/logger";
const app = express();
import { readDateJson } from "./utils/fileSystem";
import { sync } from "./sync";
import { Items } from "./db/models/local/items";
import { Tickets } from "./db/models/local/tickets";
import { PostMeta } from "./db/models/remote/wpdn_postmeta";
import { ProductMeta } from "./db/models/remote/wpdn_wc_product_meta_lookup";
import { UnitsTotals } from "./constants/units";

const corsOptions = {
  origin: ["http://localhost:8081", "http://localhost:5000"],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));
app.get("/lastconnection", (_req, res) => {
  const lastConnection = readDateJson();
  res.send({ lastConnection });
});

app.get("/sync", async (_req, res) => {
  await sync();
  const lastConnection = readDateJson();
  res.send({ lastConnection });
});

app.get("/product", async (req, res) => {
  const nameOrId = req.query.name ?? req.query.id;
  if (!nameOrId) {
    return res.send({ products: [] });
  }
  const products = await Items.findByName(nameOrId as string);
  const totalsGrams = await PostMeta.findByProductIds(products.map((p) => p.productId));
  const totalsUnits = await ProductMeta.findByProductIds(products.map((p) => p.productId));

  const getTotals = (totals: UnitsTotals[], product: Items) => {
    return totals.reduce((acc, t) => {
      if (t.productId === product.productId) {
        acc.quantity = t.quantity ?? 0;
        acc.lowStock = t.lowStock ?? 0;
      }
      return acc;
    }, {} as UnitsTotals);
  };

  res.send({
    products: products.map((product) => ({
      ...product.toJSON(),
      ...getTotals(totalsGrams, product),
      ...getTotals(totalsUnits, product),
    })),
  });
});

app.post("/addticket", async (req, res) => {
  const product = req.body;
  if (!product) {
    logger.error("No ticket received");
    return res.sendStatus(400);
  }

  await Tickets.create({
    ...product,
    Weight: parseFloat(product.Weight),
    SaleForm: product.Unit?.toLowerCase() === "grams" ? 1 : 0,
    LineDateTime: new Date(),
  });
  res.sendStatus(200);
});

app.post("/change", async (req, res) => {
  const change = req.body;
  if (!change) {
    logger.error("No change request received");
    return res.sendStatus(400);
  }
  const parsedAmount = parseFloat(change.amount);
  if (isNaN(parsedAmount)) {
    logger.error("Amount is not a number");
    return res.sendStatus(400);
  }

  if (change.units?.toLowerCase() === "grams") {
    await PostMeta.changeAmount(change.id, change.action, parsedAmount);
  } else if (change.units?.toLowerCase() === "unit") {
    await ProductMeta.changeAmount(change.id, change.action, parsedAmount);
  } else {
    logger.error(`Unit ${change?.units} no existe, el valor debe ser o 'grams' o 'unit'`);
    return res.sendStatus(400);
  }
  res.sendStatus(200);
});

app.listen(SERVER_PORT, () => {
  logger.info(`App listening at http://localhost:${SERVER_PORT}`);
});

process.on("uncaughtException", (error: Error) => logger.error(error.message));
process.on("unhandledRejection", (error: Error) => logger.error(error.message));
