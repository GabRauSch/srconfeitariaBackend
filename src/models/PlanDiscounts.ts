import sequelize from "../config/mysql";
import { Model, DataTypes, QueryTypes, where, Transaction } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import Product from "./Products";
import Orders from "./Orders";
import PlanPayments from "./PlanPayments";

export interface PlanDiscountsAttributes {
    id: number,
    applicableDiscountId: number
    userId: number,
    code: string,
    amount: number,
    usedCount: number
}

export type DiscountData = {
    applicableDiscountId: number,
    userId: number,
    code: string,
    amount: number,
}

export class PlanDiscounts extends Model implements PlanDiscountsAttributes{
    public id!: number;
    public applicableDiscountId!: number;
    public userId!: number;
    public amount!: number;
    public code!: string;
    public usedCount!: number;

    static async createDiscount(data: DiscountData,transaction: Transaction){
        try {
            const {applicableDiscountId, userId, code, amount} = data
            const planDiscount = await PlanDiscounts.create({applicableDiscountId, userId, code, amount}, {transaction})
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async useDiscount(userId: number, discountId: number){
        try {
            
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}

PlanDiscounts.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    applicableDiscountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ApplicableDiscounts',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    code: {
        type: DataTypes.STRING,

    },
    amount: {
        type: DataTypes.FLOAT
    },
    usedCount: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: 'PlanDiscounts',
    tableName: 'planDiscounts',
    timestamps: true
});

export default PlanDiscounts;
