import { OrderPayments } from "../repositories/OrderPayments";
import sequelize from "../config/mysql";
import { DataTypes } from "sequelize";

OrderPayments.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    paymentDay: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'OrderPayments',
    tableName: 'orderPayments',
    timestamps: false
});

export default OrderPayments