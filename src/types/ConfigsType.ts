import { Optional } from "sequelize";

export interface ConfigAttributes {
    id: number,
    userId: number
    toleranceDays: number,
}