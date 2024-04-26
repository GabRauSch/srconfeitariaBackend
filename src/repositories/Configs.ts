import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { ConfigAttributes } from "../types/ConfigsType";

export class Configs extends Model implements ConfigAttributes{
    public id!: number;
    public userId!: number;
    public toleranceDays!: number;

    static async findByUserId(userId: number): Promise<Configs | CustomError> {
        try {
            const client = await Configs.findOne({ where: { userId } });
            if (!client) 
                return PatternResponses.createError('noRegister', ['client']);

            return client;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}
