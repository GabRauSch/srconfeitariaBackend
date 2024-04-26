import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { PlanPaymentAttributes } from "../types/PlanPaymentType";

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