import { Model, DataTypes } from "sequelize";
import logger from "../../../utils/logger";
import { remoteDatabase } from "../../config/connection";

export class Totals extends Model {
  public Id: string;
  public ProductId: number;
  public Name: string;
  public Total: number;
  public Limit: number;

  public static findByProductIds(ProductId: number[]) {
    return Totals.findAll({ where: { ProductId } });
  }

  public static substractFromTotals(totals: Record<string, number>) {
    Object.entries(totals).map(async ([ProductId, quantity]) => {
      const product = await Totals.findOne({ where: { ProductId } });
      if (!product) {
        return logger.error(`El producto Nº${ProductId} no existe`);
      }
      const newTotal = (product?.Total ?? 0) - quantity;
      if (newTotal < 0) {
        logger.warn(`El total del producto Nº${ProductId} es menor a 0`);
        product.Total = 0;
      } else {
        product.Total = newTotal;
      }
      await product?.save();
    });
  }
}

Totals.init(
  {
    Id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    ProductId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    Name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    Total: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    Limit: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
  },
  { sequelize: remoteDatabase, tableName: "totals", timestamps: false }
);
