import { Optional } from "sequelize";
import Clients from "../models/Clients";
import { Location } from "./Location";

export interface ClientsAttributes {
    id: number;
    userId: number;
    name: string;
    phone: string;
    email: string;
    birthday: Date;
    postalCode: number;
    local: Location
}
export interface ClientsCreation extends Optional<Clients, 'id'> {}
