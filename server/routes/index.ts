import { readDateJson } from "../utils/fileSystem";
import { sync } from "../sync";
import { Items } from "../db/models/local/items";
import { Tickets } from "../db/models/local/tickets";
import { PostMeta } from "../db/models/remote/wpdn_postmeta";
import { UnitsTotals } from "../constants/units";
import { Router } from "express";
import logger from "../utils/logger";
const router = Router();

router.get("/lastconnection", (_req, res) => {
  const lastConnection = readDateJson().toLocaleString();
  res.send({ lastConnection });
});

router.get("/sync", async (_req, res) => {
  await sync();
  const lastConnection = readDateJson().toLocaleString();
  res.send({ lastConnection });
});

router.get("/product", async (req, res) => {
  const nameOrId = req.query.name ?? req.query.id;
  if (!nameOrId) {
    return res.send({ products: [] });
  }
  const products = await Items.findByName(nameOrId as string);
  const totals = await PostMeta.findByProductIds(products.map((p) => p.productId));

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
      ...getTotals(totals, product),
    })),
  });
});

router.post("/addticket", async (req, res) => {
  const product = req.body;
  if (!product?.Item) {
    logger.error("No ticket received");
    return res.sendStatus(400);
  }
  try {
    await Tickets.create({
      ...product,
      Weight: parseFloat(product.Weight),
      SaleForm: product.Unit?.toLowerCase() === "grams" ? 1 : 0,
      LineDateTime: new Date(),
    });
    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
});

router.post("/change", async (req, res) => {
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

  await PostMeta.changeAmount(change.id, change.action, parsedAmount, change.units?.toLowerCase());
  res.sendStatus(200);
});

router.get("/scaledata", async (req, res) => {
  const nameOrId = req.query.id as string;
  const currentPage = req.query.currentPage as string;
  const limit = req.query.limit as string;

  let items: Items[] = [];
  let total = 0;
  if (nameOrId) {
    items = await Items.findByName(nameOrId as string);
    total = items.length;
  } else {
    items = await Items.findPaginated(parseInt(currentPage ?? "0"), parseInt(limit ?? "30"));
    total = await Items.count();
  }
  res.send({
    items: items.map((item) => ({
      SKU: item.Code,
      Nombre: item.Name,
      Receta: item.Text,
      Origen: item.Text1,
      Alergenos: item.Text2,
      Lote: item.Text3,
      Precio: item.Price,
    })),
    total,
  });
});

router.put("/scaledata", async (req, res) => {
  const productId = req.query.id as string;
  await Items.update(
    {
      Name: req.body.Nombre,
      Text: req.body.Receta,
      Text1: req.body.Origen,
      Text2: req.body.Alergenos,
      Text3: req.body.Lote,
      Price: parseFloat(req.body.Precio ?? "0"),
    },
    { where: { Code: productId }, limit: 1 }
  );

  res.sendStatus(200);
});

export default router;
