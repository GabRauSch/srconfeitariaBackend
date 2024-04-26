import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/mysql";
import { Clients } from "../repositories/Clients";

Clients.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    birthday: {
        type: DataTypes.DATE,
    },
    postalCode: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize,
    modelName: 'Clients',
    tableName: 'clients',
    timestamps: true
});

export default Clients;
