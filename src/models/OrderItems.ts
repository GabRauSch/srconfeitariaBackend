import sequelize from "../config/mysql";
import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import Product from "../models/Products";

export interface OrderItemsAttributes {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    finished: boolean 
}

export class OrderItems extends Model implements OrderItemsAttributes{
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public finished!: boolean;

    static async findByOrderId(orderId: number): Promise<OrderItems[] | CustomError> {
        try {
            const orderItem = await OrderItems.findAll({ where: { orderId } });
            if (!orderItem.length)
                return PatternResponses.createError('noRegister', ['Order Item']);

            return orderItem;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError');
        }
    }

    static async createWithProducts(userId: number, orderId: number, products: any[]): Promise<boolean | CustomError> {
        try {
            for (const product of products) {
                const productRecord = await Product.findOne({ where: { id: product.id, userId } });
                if (!productRecord)
                    return PatternResponses.createError('invalid', [`product`, 'doesn\'t belong to the user']);

                const creation = await OrderItems.create({
                    orderId, productId: product.id, quantity: product.quantity 
                });
                if (!creation) throw new Error();
            }

            return true;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError');
        }
    }

    static async destroyByOrderId(orderId: number) {
        try {
            const orderItemsDelete = await OrderItems.destroy({ where: { orderId } });
            if (!orderItemsDelete) return PatternResponses.createError('notDeleted', ['orderItems']);
            return PatternResponses.createSuccess('deleted', ['orderItems']);
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError');
        }
    }
}

OrderItems.init({
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
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'OrderItems',
    tableName: 'orderItems',
    timestamps: true
});

export default OrderItems;
