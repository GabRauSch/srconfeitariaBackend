import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { UserAttributes } from "../types/UserType";
import { userPermission } from "../mapping/userPermission";

export class Users extends Model implements UserAttributes{
    public id!: number;
    public planId!: number;
    public email!: string;
    public passwordHash!: string;
    public active!: boolean;
    public phone!: string;
    public userPermission!: userPermission;
    public acceptedTerms!: boolean;

    static async findByOrderId(orderId: number): Promise<Users[] | CustomError> {
        try {
            const orderItems = await Users.findAll({ where: { orderId } });
            if (!orderItems.length)
                return PatternResponses.error.noRegister("order items");

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return { error: error.message, errorType: "Database", code: 11 };
        }
    }
}