import { Model, DataTypes } from "sequelize";
import { UnitsTotals } from "../../../constants/units";
import logger from "../../../utils/logger";
import { remoteDatabase } from "../../config/connection";
import { PostMeta } from "./wpdn_postmeta";
import { META_KEYS, Posts } from "./wpdn_posts";

export class ProductMeta extends Model {
  public product_id: number;
  public sku: string;
  public stock_quantity: number;

  public static async findByProductIds(ProductIds: number[]): Promise<UnitsTotals[]> {
    const posts = await PostMeta.findAll({
      where: { meta_key: META_KEYS.Sku, meta_value: ProductIds },
      include: { model: Posts, where: { post_status: "publish" } },
    });

    const totals = await Promise.all(
      posts.map(async (post) => {
        const total = await ProductMeta.findOne({ where: { product_id: post.post_id } });
        const lowStock = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.LowStock } });
        if (!post) {
          return {};
        }

        return {
          productId: parseInt(post?.meta_value),
          quantity: total.stock_quantity,
          lowStock: parseInt(lowStock?.meta_value ?? "0"),
        };
      })
    );

    return totals.filter((t) => t.productId) as UnitsTotals[];
  }

  public static async substractFromTotals(totals: Record<string, number>): Promise<void> {
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
        const total = await ProductMeta.findOne({ where: { product_id: post.post_id } });
        if (!total) {
          return logger.error(`
          No hay creado un stock para el producto Nº${ProductId} en wordpress.
          Cantidad vendida: ${quantity}. Actualizar manualmente.`);
        }
        const newTotal = total.stock_quantity - quantity;
        if (newTotal < 0) {
          logger.warn(`
          El total del producto Nº${ProductId} es menor a 0.
          Cantidad en wordpress: ${total.stock_quantity},
          Cantidad vendida: ${quantity},
          Venta extra (total - venta): ${newTotal}
          `);
          total.stock_quantity = 0;
        } else {
          total.stock_quantity = newTotal;
        }
        await total.save();
      })
    );
  }

  public static async changeAmount(ProductId: string, action: string, amount: number) {
    const post = await PostMeta.findOne({
      where: { meta_key: META_KEYS.Sku, meta_value: ProductId },
      include: { model: Posts, where: { post_status: "publish" } },
    });
    if (!post) {
      logger.error(`El producto Nº${ProductId} no existe, SKU no encontrado`);
      return { error: true };
    }
    const total = await ProductMeta.findOne({ where: { product_id: post.post_id } });
    if (!total) {
      logger.error(`El producto Nº${ProductId} no existe, SKU no encontrado`);
      return { error: true };
    }
    if (action === "add") {
      const newTotal = total.stock_quantity + amount;
      total.stock_quantity = newTotal;
    } else if (action === "replace") {
      total.stock_quantity = amount;
    } else {
      logger.error("Action is not valid");
      return { error: true };
    }
    await total.save();
  }
}

ProductMeta.init(
  {
    product_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    sku: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    stock_quantity: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
  },
  { sequelize: remoteDatabase, tableName: "wpdn_wc_product_meta_lookup", timestamps: false }
);
