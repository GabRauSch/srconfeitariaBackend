import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { ClientsAttributes } from "../types/ClientsType";
import { Location } from "../types/Location";
import { CateogriesAttributes } from "../types/CategoriesType";

export class Categories extends Model implements CateogriesAttributes{
    public id!: number;
    public userId!: number;
    public description!: string;

    static async findByUserId(userId: number): Promise<Categories | CustomError> {
        try {
            const client = await Categories.findOne({ where: { userId } });
            if (!client) 
                return PatternResponses.error.noRegister("clients");

            return client;
        } catch (error: any) {
            console.error(error);
            return { error: error.message, errorType: "Database", code: 11 };
        }
    }
}
