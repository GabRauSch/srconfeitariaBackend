import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { OrderItemsAttributes } from "../types/OrderItemsType";

export class OrderItems extends Model implements OrderItemsAttributes{
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public finished!: boolean;

    static async findByOrderId(orderId: number): Promise<OrderItems[] | CustomError> {
        try {
            const orderItem = await OrderItems.findAll({ where: { orderId } });
            if (!orderItem.length)
                return PatternResponses.error.noRegister("order items");

            return orderItem;
        } catch (error: any) {
            console.error(error);
            return { error: error.message, errorType: "Database", code: 11 };
        }
    }
}