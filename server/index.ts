import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { PORT } from "./constants/config";
import logger from "./utils/logger";
const app = express();
import "./daemon";
import { readDateJson } from "./utils/fileSystem";
import { sync } from "./daemon";
import { Items } from "./db/models/local/items";
import { Tickets } from "./db/models/local/tickets";
import { Totals } from "./db/models/remote/totals";

const corsOptions = {
  origin: ["http://localhost:8081"],
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
  const totals = await Totals.findByProductIds(products.map((p) => p.productId));
  res.send({
    products: products.map((product) => ({
      ...product.toJSON(),
      ...totals.reduce((acc, t) => {
        if (t.ProductId === product.productId) {
          acc.Total = t.Total ?? 0;
          acc.Limit = t.Limit ?? 0;
        }
        return acc;
      }, {} as Partial<Totals>),
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

  const product = await Totals.findOne({ where: { ProductId: change.id } });
  if (!product) {
    logger.error("No total found");
    return res.sendStatus(400);
  }
  const parsedAmount = parseFloat(change.amount);
  if (isNaN(parsedAmount)) {
    logger.error("Amount is not a number");
    return res.sendStatus(400);
  }
  if (change.action === "add") {
    product.Total += parsedAmount;
  } else if (change.action === "replace") {
    product.Total = parsedAmount;
  } else {
    logger.error("Action is not valid");
    return res.sendStatus(400);
  }
  await product.save();

  res.sendStatus(200);
});

app.listen(PORT, () => {
  logger.info(`App listening at http://localhost:${PORT}`);
});

process.on("uncaughtException", (error: Error) => logger.error(error.message));
process.on("unhandledRejection", (error: Error) => logger.error(error.message));
