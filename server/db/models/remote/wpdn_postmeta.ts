import { Model, DataTypes } from "sequelize";
import logger from "../../../utils/logger";
import { remoteDatabase } from "../../config/connection";
import { Posts } from "./wpdn_posts";

export const META_KEYS = {
  Sku: "_sku",
  Quantity: "_quantity",
  LowStock: "_low_stock",
};

export interface Totals {
  productId: number;
  quantity: number;
  lowStock: number;
}

export class PostMeta extends Model {
  public meta_id: string;
  public post_id: string;
  public meta_key: string;
  public meta_value: string;

  public static async findByProductIds(ProductId: number[]): Promise<Totals[]> {
    const posts = await PostMeta.findAll({
      where: { meta_key: META_KEYS.Sku, meta_value: ProductId },
      include: { model: Posts, where: { post_status: "publish" } },
    });

    const totals = await Promise.all(
      posts.map(async (post) => {
        const total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Quantity } });
        const lowStock = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.LowStock } });
        if (!post) {
          return {};
        }

        return {
          productId: parseInt(post?.meta_value),
          quantity: parseInt(total?.meta_value ?? "0"),
          lowStock: parseInt(lowStock?.meta_value ?? "0"),
        };
      })
    );

    return totals.filter((t) => t.productId) as Totals[];
  }

  public static async substractFromTotals(totals: Record<string, number>): Promise<void> {
    await Promise.all(
      Object.entries(totals).map(async ([ProductId, quantity]) => {
        const post = await PostMeta.findOne({
          where: { meta_key: META_KEYS.Sku, meta_value: ProductId },
          include: { model: Posts, where: { post_status: "publish" } },
        });
        if (!post) {
          return logger.error(`El sku del producto Nº${ProductId} no existe en wordpress`);
        }
        const total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Quantity } });
        if (!total) {
          return logger.error(`El total producto Nº${ProductId} no existe en wordpress`);
        }
        const newTotal = parseInt(total.meta_value ?? "0") - quantity;
        if (newTotal < 0) {
          logger.warn(`El total del producto Nº${ProductId} es menor a 0`);
          total.meta_value = "0";
        } else {
          total.meta_value = newTotal.toString();
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
      logger.error(`El producto Nº${ProductId} no existe`);
      return { error: true };
    }
    const total = await PostMeta.findOne({ where: { post_id: post.post_id, meta_key: META_KEYS.Quantity } });
    if (!total) {
      logger.error(`El total del producto Nº${ProductId} no existe`);
      return { error: true };
    }
    if (action === "add") {
      const newTotal = parseInt(total.meta_value ?? "0") + amount;
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
