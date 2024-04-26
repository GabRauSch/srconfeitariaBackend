import { DataTypes } from "sequelize";
import {Users}  from "../repositories/Users";
import {Clients} from "../repositories/Clients";
import { Orders } from "../repositories/Orders";
import sequelize from "../config/mysql";

Orders.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        key: typeof Users,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    clientId: {
        type: DataTypes.INTEGER,
        key: typeof Clients,
        allowNull: false,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    orderNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deliveryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deliveryCost: {
        type: DataTypes.INTEGER,
    },
    delivered: {
        type: DataTypes.DATE,
        allowNull: true
    },
    orderStatus: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Orders',
    tableName: 'orders',
    timestamps: true
});

export default Orders