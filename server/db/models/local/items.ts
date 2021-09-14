import { Model, DataTypes, Op } from "sequelize";
import { localDatabase } from "../../config/connection";

export enum Units {
  UNIT = 0,
  GRAMS = 1,
}

export class Items extends Model {
  public Id: string;
  public SaleForm: number;
  public Code: number;
  public Name: string;

  public get units() {
    return Units[this.SaleForm];
  }

  public get productId() {
    return this.Code;
  }

  public static findByName(nameOrId: string) {
    return Items.findAll({
      where: {
        [Op.or]: [{ Name: { [Op.like]: `%${nameOrId}%` } }, { Code: nameOrId }],
      },
    });
  }
}
Items.init(
  {
    Id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    SaleForm: {
      allowNull: false,
      type: DataTypes.SMALLINT,
    },
    Code: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    Name: {
      allowNull: false,
      type: DataTypes.STRING(127),
    },
    units: {
      type: DataTypes.VIRTUAL,
      get() {
        return Units[this.SaleForm];
      },
    },
    productId: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.Code;
      },
    },
  },
  { sequelize: localDatabase, tableName: "items", timestamps: false }
);
