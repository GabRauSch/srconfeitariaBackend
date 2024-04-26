import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { ClientsAttributes } from "../types/ClientsType";
import { Location } from "../types/Location";

export class Clients extends Model implements ClientsAttributes{
    public id!: number;
    public userId!: number;
    public name!: string;
    public phone!: string;
    public email!: string;
    public local!: Location;
    public birthday!: Date;
    public postalCode!: number;
    public permission!: number;


    static async findByUserId(userId: number): Promise<Clients[] | CustomError> {
        try {
            const clients = await Clients.findAll({ where: { userId } });
            if (clients.length === 0) 
                return PatternResponses.createError('noRegister', ["clients"]);

            return clients;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError');
        }
    }
    static async findByName(userId: number, name: string): Promise<Clients[] | CustomError> {
        try {
            const clients = await Clients.findAll({ where: { userId, name } });
            if (clients.length === 0) 
                return PatternResponses.createError('noRegister', ["clients"]);

            return clients;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError');
        }
    }
    static async findById(id: number): Promise<Clients | CustomError> {
        try {
            const client = await Clients.findByPk(id);
            if (!client) 
                return PatternResponses.createError('noRegisterWithId', ["client", id]);

            return client;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}
