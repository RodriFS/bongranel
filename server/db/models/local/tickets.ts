import { Model, DataTypes, Op } from "sequelize";
import { localDatabase } from "../../config/connection";

export enum Units {
  UNIT = 0,
  GRAMS = 1,
}

export class Tickets extends Model {
  public Id: string;
  public SaleForm: number;
  public Item: number;
  public Name: string;
  public LineDateTime: Date;
  public Weight: number;
  public Amount: string;
  public Price: number;

  public get units() {
    return Units[this.SaleForm];
  }

  public get productId() {
    return this.Item;
  }

  public get amountSold() {
    return this.Weight;
  }

  public static getLastTickets(lastDate: Date, newDate: Date) {
    return Tickets.findAll({
      where: {
        [Op.and]: [{ LineDateTime: { [Op.gte]: lastDate } }, { LineDateTime: { [Op.lt]: newDate } }],
      },
    });
  }
}
Tickets.init(
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
    Item: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    Name: {
      allowNull: false,
      type: DataTypes.STRING(127),
    },
    LineDateTime: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    Weight: {
      allowNull: false,
      type: DataTypes.DECIMAL(7, 3),
      get() {
        return parseFloat(this.getDataValue("Weight"));
      },
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
        return this.Item;
      },
    },
    amountSold: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.Weight;
      },
    },
    Amount: {
      allowNull: true,
      type: DataTypes.DECIMAL(10, 2),
    },
    Price: {
      allowNull: true,
      type: DataTypes.DECIMAL(8, 2),
    },
  },
  { sequelize: localDatabase, tableName: "ltickets", timestamps: false }
);
