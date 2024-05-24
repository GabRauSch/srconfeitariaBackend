import sequelize from "../config/mysql";
import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

export interface PlanAttributes {
    id: number,
    planValue: number,
    planId: number,
    description: string,
    durationDays: number
}

export class Plans extends Model implements PlanAttributes{
    public id!: number;
    public planValue!: number;
    public planId!: number;
    public description!: string;
    public durationDays!: number;

    static async findByOrderId(orderId: number): Promise<Plans[] | CustomError> {
        try {
            const orderItems = await Plans.findAll({ where: { orderId } });
            if (!orderItems.length)
                return PatternResponses.createError('noRegister');

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}

Plans.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    planValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    durationDays: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Plans',
    tableName: 'plans',
    timestamps: false
});

export default Plans