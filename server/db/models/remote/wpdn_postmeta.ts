import { Model, DataTypes } from "sequelize";
import { UnitsTotals } from "../../../constants/units";
import logger from "../../../utils/logger";
import { remoteDatabase } from "../../config/connection";
import { Posts } from "./wpdn_posts";

export const META_KEYS = {
  Sku: "_sku",
  Quantity: "_quantity",
  Stock: "_stock",
  LowStock: "_low_stock",
};

export class PostMeta extends Model {
  public meta_id: string;
  public post_id: string;
  public meta_key: string;
  public meta_value: string;

  public static async findByProductIds(ProductId: number[]): Promise<UnitsTotals[]> {
    const posts = await PostMeta.findAll({
      where: { meta_key: META_KEYS.Sku, meta_value: ProductId },
      include: { model: Posts, where: { post_status: "publish" } },
    });

    const totals = await Promise.all(
      posts.map(async (post) => {
        let total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Quantity } });
        if (!total?.meta_value) {
          total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Stock } });
        }
        const lowStock = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.LowStock } });
        if (!post) {
          return {};
        }

        return {
          productId: parseFloat(post?.meta_value),
          quantity: parseFloat(total?.meta_value ?? "0"),
          lowStock: parseFloat(lowStock?.meta_value ?? "0"),
        };
      })
    );

    return totals.filter((t) => t.productId) as UnitsTotals[];
  }

  public static async substractFromTotals(totals: Record<string, number>, units: string): Promise<void> {
    await Promise.all(
      Object.entries(totals).map(async ([ProductId, quantity]) => {
        const post = await PostMeta.findOne({
          where: { meta_key: META_KEYS.Sku, meta_value: ProductId },
          include: { model: Posts, where: { post_status: "publish" } },
        });
        if (!post) {
          return logger.error(
            `El sku del producto Nº${ProductId} no existe en wordpress.
             Cantidad vendida: ${quantity}. Actualizar manualmente.`
          );
        }
        let total: PostMeta | null = null;
        if (units === "grams") {
          total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Quantity } });
        } else if (units === "unit") {
          total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Stock } });
        }
        if (!total) {
          return logger.error(`
          No hay creado un stock para el producto Nº${ProductId} en wordpress.
          Cantidad vendida: ${quantity}. Actualizar manualmente.`);
        }
        const newTotal = parseFloat(total.meta_value ?? "0") - quantity;
        if (newTotal < 0) {
          logger.warn(`
          El total del producto Nº${ProductId} es menor a 0.
          Cantidad en wordpress: ${total.meta_value},
          Cantidad vendida: ${quantity},
          Venta extra (total - venta): ${newTotal}
          `);
          total.meta_value = "0";
        } else {
          total.meta_value = newTotal.toString();
        }
        await total.save();
      })
    );
  }

  public static async changeAmount(ProductId: string, action: string, amount: number, units: string) {
    const post = await PostMeta.findOne({
      where: { meta_key: META_KEYS.Sku, meta_value: ProductId },
      include: { model: Posts, where: { post_status: "publish" } },
    });
    if (!post) {
      logger.error(`El producto Nº${ProductId} no existe, SKU no encontrado`);
      return { error: true };
    }
    let total: PostMeta | null = null;
    if (units == "grams") {
      total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Quantity } });
    } else if (units == "unit") {
      total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Stock } });
    } else {
      logger.error(`Unit ${units} no existe, el valor debe ser o 'grams' o 'unit'`);
      return;
    }
    if (!total) {
      logger.warn(`El total del producto Nº${ProductId} no existe, generando.`);
      total = await PostMeta.create({
        post_id: post.post_id,
        meta_key: META_KEYS.Quantity,
        meta_value: 0,
      });
    }
    if (action === "add") {
      const newTotal = parseFloat(total.meta_value ?? "0") + amount;
      total.meta_value = newTotal.toString();
    } else if (action === "replace") {
      total.meta_value = amount.toString();
    } else {
      logger.error("Action is not valid");
      return { error: true };
    }
    await total.save();
  }
}

PostMeta.init(
  {
    meta_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    post_id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    meta_key: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    meta_value: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  { sequelize: remoteDatabase, tableName: "wpdn_postmeta", timestamps: false }
);

PostMeta.belongsTo(Posts, { foreignKey: "post_id" });
