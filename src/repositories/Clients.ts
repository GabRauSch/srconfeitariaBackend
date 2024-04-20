
import { Model } from "sequelize";
import { ClientsAttributes, ClientsCreation } from "../types/ClientsType";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

export class Clients extends Model<ClientsAttributes, ClientsCreation> implements ClientsAttributes {
    public id!: number;
    public storeId!: number;
    public discount!: number;
    public discountName!: string;
    public endDate!: Date;
    public createdAt!: Date;

    static async findByStoreId(id: number): Promise<Clients | CustomError> {
        try {
            const client = await Clients.findByPk(id);
            if(!client) 
                return PatternResponses.error.noRegister("clients") 

            return client;
        } catch (error: any) {
            console.error(error);
            return {error: error.message, errorType: "Database", code: 11};
        }
    }
}
