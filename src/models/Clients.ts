import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/mysql";
import { Clients } from "../repositories/Clients";

Clients.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storeId: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    discountName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    timestamps: false
});

export default Clients;
