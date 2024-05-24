import { DataTypes, Model } from "sequelize";
import sequelize from "../config/mysql";

import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

import { Optional } from "sequelize";

export interface ConfigAttributes {
    id: number,
    userId: number
    toleranceDays: number,
}

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


Configs.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    toleranceDays: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Config',
    tableName: 'config',
    timestamps: false
});

export default Configs