import { DataTypes } from "sequelize";
import { Plans } from "../repositories/Plans";
import sequelize from "../config/mysql";

Plans.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    planValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    durationDays: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Plans',
    tableName: 'plans',
    timestamps: false
});

export default Plans