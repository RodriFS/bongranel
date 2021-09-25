import { Model, DataTypes } from "sequelize";
import { UnitsTotals } from "../../../constants/units";
import logger from "../../../utils/logger";
import { remoteDatabase } from "../../config/connection";

export class ProductMeta extends Model {
  public product_id: number;
  public sku: string;
  public stock_quantity: number;

  public static async findByProductIds(ProductIds: number[]): Promise<UnitsTotals[]> {
    const products = await ProductMeta.findAll({ where: { sku: ProductIds } });
    return Promise.all(
      products.map(async (product) => {
        return {
          productId: parseInt(product.sku),
          quantity: product.stock_quantity,
          lowStock: 0,
        };
      })
    );
  }

  public static async substractFromTotals(totals: Record<string, number>): Promise<void> {
    await Promise.all(
      Object.entries(totals).map(async ([ProductId, quantity]) => {
        const product = await ProductMeta.findOne({ where: { sku: ProductId } });
        if (!product) {
          return logger.error(
            `El sku del producto Nº${ProductId} no existe en wordpress.
             Cantidad vendida: ${quantity}. Actualizar manualmente.`
          );
        }
        const newTotal = product.stock_quantity - quantity;
        if (newTotal < 0) {
          logger.warn(`
          El total del producto Nº${ProductId} es menor a 0.
          Cantidad en wordpress: ${product.stock_quantity},
          Cantidad vendida: ${quantity},
          Venta extra (total - venta): ${newTotal}
          `);
          product.stock_quantity = 0;
        } else {
          product.stock_quantity = newTotal;
        }
        await product.save();
      })
    );
  }

  public static async changeAmount(ProductId: string, action: string, amount: number) {
    const product = await ProductMeta.findOne({ where: { sku: ProductId } });
    if (!product) {
      logger.error(`El producto Nº${ProductId} no existe, SKU no encontrado`);
      return { error: true };
    }
    if (action === "add") {
      const newTotal = product.stock_quantity + amount;
      product.stock_quantity = newTotal;
    } else if (action === "replace") {
      product.stock_quantity = amount;
    } else {
      logger.error("Action is not valid");
      return { error: true };
    }
    await product.save();
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
