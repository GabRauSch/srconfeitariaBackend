import { Optional } from "sequelize";
import Clients from "../models/Clients";

export interface ClientsAttributes {
    id: number;
    storeId: number;
    discount: number;
    discountName: string;
    endDate: Date;
    createdAt: Date;
}
export interface ClientsCreation extends Optional<Clients, 'id' | 'createdAt'> {}
