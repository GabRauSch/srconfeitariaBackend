import sequelize from "../config/mysql";
import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

export interface PlanPaymentAttributes {
    id: number,
    planId: number,
    date: Date,
    value: number
}

export class PlanPayments extends Model implements PlanPaymentAttributes {
    public id!: number;
    public planId!: number;
    public date!: Date;
    public value!: number;

    static async findByOrderId(orderId: number): Promise<PlanPayments[] | CustomError> {
        try {
            const orderItems = await PlanPayments.findAll({ where: { orderId } });
            if (!orderItems.length)
                return PatternResponses.createError('noRegister');

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}

PlanPayments.init({
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
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'PlanPayments',
    tableName: 'planPayments',
    timestamps: false
});

export default PlanPayments