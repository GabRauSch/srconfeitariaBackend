import { DataTypes } from "sequelize";
import { PlanPayments } from "../repositories/PlanPayments";
import sequelize from "../config/mysql";

PlanPayments.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Plans',
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'PlanPayments',
    tableName: 'planPayments',
    timestamps: false
});

export default PlanPayments