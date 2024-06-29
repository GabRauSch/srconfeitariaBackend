import sequelize from "../config/mysql";
import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

export interface PlanPaymentAttributes {
    id: number,
    userId: number,
    planId: number,
    discountId: number
    dueDate: Date,
    paymentDate: Date,
    value: number,
}

export class PlanPayments extends Model implements PlanPaymentAttributes {
    public id!: number;
    public userId!: number;
    public planId!: number;
    public discountId!: number;
    public dueDate!: Date;
    public paymentDate!: Date;
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Plans',
            key: 'id'
        }
    },
    discountId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'PlanDiscounts',
            key: 'id'
        },
        allowNull: true
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    paymentDate: DataTypes.DATE,
    value: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    paidValue: {
        type: DataTypes.FLOAT,
    },
}, {
    sequelize,
    modelName: 'PlanPayments',
    tableName: 'planPayments',
    timestamps: true
});

export default PlanPayments