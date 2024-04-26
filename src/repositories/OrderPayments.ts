import { Model } from "sequelize";
import { OrderPaymentsAttributes } from "../types/OrderPaymentsType";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

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