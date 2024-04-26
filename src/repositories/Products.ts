import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { ProductAttributes } from "../types/ProductsType";

export class Products extends Model implements ProductAttributes{
    public id!: number;
    public userId!: number;
    public categoryId!: number;
    public description!: string;
    public size!: string;
    public format!: string;
    public weight!: number;
    public value!: number;
    public productionCost!: number;
    public photo!: string;

    static async findByOrderId(orderId: number): Promise<Products[] | CustomError> {
        try {
            const orderItems = await Products.findAll({ where: { orderId } });
            if (!orderItems.length)
                return PatternResponses.error.noRegister("order items");

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return { error: error.message, errorType: "Database", code: 11 };
        }
    }
}