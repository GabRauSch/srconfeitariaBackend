import sequelize from "../config/mysql";
import { DataTypes } from "sequelize";
import { Model } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

export interface OrderPaymentsAttributes {
    id: number,
    orderId: number,
    value: number,
    dueDate: Date,
    paymentDay: Date
}

export class OrderPayments extends Model implements OrderPaymentsAttributes{
    public id!: number;
    public orderId!: number;
    public value!: number;
    public dueDate!: Date;
    public paymentDay!: Date;

    static async findByOrderId(orderId: number): Promise<OrderPayments[] | CustomError> {
        try {
            const orderPayments = await OrderPayments.findAll({ where: { orderId } });
            if (!orderPayments.length)
                return PatternResponses.createError('noRegister', ['Order Payment']);

            return orderPayments;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}

OrderPayments.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    paymentDay: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'OrderPayments',
    tableName: 'orderPayments',
    timestamps: false
});

export default OrderPayments