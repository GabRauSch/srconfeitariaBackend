import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { ProductAttributes } from "../types/ProductsType";

export class Products extends Model implements ProductAttributes{
    public id!: number;
    public userId!: number;
    public categoryId!: number;
    public name!: string;
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
                return PatternResponses.createError('noRegister');

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async findByUserId(userId: number): Promise<Products[] | CustomError> {
        try {
            const orderItems = await Products.findAll({ where: { userId } });
            if (!orderItems.length)
                return PatternResponses.createError('noRegister');

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async findById(id: number): Promise<Products | CustomError> {
        try {
            const product = await Products.findByPk(id);
            if (!product) 
                return PatternResponses.createError('noRegisterWithId', ["product", id]);

            return product;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}