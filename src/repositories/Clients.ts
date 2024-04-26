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
                return PatternResponses.error.noRegister("clients");

            return clients;
        } catch (error: any) {
            console.error(error);
            return { error: error.message, errorType: "Database", code: 11 };
        }
    }
    static async findById(userId: number): Promise<Clients | CustomError> {
        try {
            const client = await Clients.findByPk(userId);
            if (!client) 
                return PatternResponses.error.noRegisterWithId("client", userId);

            return client;
        } catch (error: any) {
            console.error(error);
            return { error: error.message, errorType: "Database", code: 11 };
        }
    }
}
