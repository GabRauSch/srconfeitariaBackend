import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { OrderAttributes } from "../types/OrdersType";
import { OrderStatus } from "../mapping/orderStatus";

export class Orders extends Model implements OrderAttributes {
    public id!: number;
    public clientId!: number;
    public orderNumber!: number;
    public deliveryDate!: Date;
    public value!: number;
    public deliveryCost!: number;
    public orderStatus!: OrderStatus;
    public delivered!: Date;

    static async findByOrderId(orderId: number): Promise<Orders[] | CustomError> {
        try {
            const orderItems = await Orders.findAll({ where: { orderId } });
            if (!orderItems.length)
                return PatternResponses.error.noRegister("order items");

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return { error: error.message, errorType: "Database", code: 11 };
        }
    }
}