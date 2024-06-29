import sequelize from "../config/mysql";
import { Model, DataTypes, QueryTypes, where, Transaction } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import Product from "./Products";
import Orders from "./Orders";

export interface ApplicableDiscountsAttributes {
    id: number,
    description: string,
    amount: number,
    planId: number
}

export class ApplicableDiscounts extends Model implements ApplicableDiscountsAttributes{
    public id!: number;
    public description!: string;
    public amount!: number
    public planId!: number;
    
    static async findByDescription(description: string, transaction: Transaction): Promise<ApplicableDiscountsAttributes | CustomError>{
        try {
            const planDiscount = await ApplicableDiscounts.findOne({where: {description}, transaction});
            return planDiscount ? planDiscount : PatternResponses.createError('noRegister', ['planDiscount'])
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }

        
    static async createDiscount(refferalCode: string, userId: number, discountId: number){
        try {
            const planDiscount = await ApplicableDiscounts.create({})
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }

    }
}

ApplicableDiscounts.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Plans',
            key: 'id'
        }
    },
    description: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.FLOAT
    },
}, {
    sequelize,
    modelName: 'ApplicableDiscounts',
    tableName: 'applicableDiscounts',
    timestamps: true
});

export default ApplicableDiscounts;
