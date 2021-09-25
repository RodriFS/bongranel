import { Model, DataTypes } from "sequelize";
import logger from "../../../utils/logger";
import { remoteDatabase } from "../../config/connection";

export const META_KEYS = {
  Sku: "_sku",
  Quantity: "_quantity",
  LowStock: "_low_stock",
};

export class Posts extends Model {
  public ID: number;
  public post_status: string;
}

Posts.init(
  {
    ID: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    post_status: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 0,
    },
  },
  { sequelize: remoteDatabase, tableName: "wpdn_posts", timestamps: false }
);
