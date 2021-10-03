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
  public Text: string;
  public Text1: string;
  public Text2: string;
  public Text3: string;
  public Price: string;

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

  public static findPaginated(currentPage: number, limit: number) {
    return Items.findAll({
      where: {
        [Op.and]: [{ Code: { [Op.gte]: currentPage * limit } }, { Code: { [Op.lt]: currentPage * limit + limit } }],
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
    Text: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    Text1: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    Text2: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    Text3: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    Price: {
      allowNull: false,
      type: DataTypes.DECIMAL(8, 2),
    },
  },
  { sequelize: localDatabase, tableName: "items", timestamps: false }
);
