import { Model, DataTypes } from "sequelize";
import { remoteDatabase } from "../config/connection";

export class Totals extends Model {
  public Id: string;
}
Totals.init(
  {
    Id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
  },
  { sequelize: remoteDatabase, tableName: "totals", timestamps: false }
);
