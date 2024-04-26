import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { PlanAttributes } from "../types/PlansType";

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