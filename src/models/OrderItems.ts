import sequelize from "../config/mysql";
import { Model, DataTypes, QueryTypes, where, Transaction } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import Product from "../models/Products";
import Orders from "./Orders";

export interface OrderItemsAttributes {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    finished: boolean,
    value: number
}

type orderItemData = {productId: number, quantity: number, finished: boolean}[]

export class OrderItems extends Model implements OrderItemsAttributes{
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public finished!: boolean;
    public value!: number

    static async findByOrderId(id: number): Promise<any | CustomError> {
        try {
            const combinedQuery = `
            SELECT 
                o.id AS orderId, o.orderStatus, o.orderNumber, o.deliveryDate, o.value AS totalValue, o.deliveryCost, 
                c.name AS clientName, c.id AS clientId,
                oi.id AS orderItemId, oi.quantity, oi.finished, 
                p.id AS productId, p.name AS productName, oi.value
            FROM orders o
            JOIN clients c ON c.id = o.clientId
            JOIN orderitems oi ON oi.orderId = o.id
            JOIN products p ON p.id = oi.productId
            WHERE o.id = :orderId
            `;

            const resultCombined: any[] = await sequelize.query(combinedQuery, {
                replacements: { orderId: id },
                type: QueryTypes.SELECT
            });

            if(resultCombined.length == 0) return PatternResponses.createError('noRegister', ['orderItems'])

            const {
                orderId, orderStatus, orderNumber, deliveryDate, totalValue, deliveryCost, clientName, clientId
            } = resultCombined[0];
        
            const orderItems = resultCombined.map(item => ({
                orderItemId: item.orderItemId,
                quantity: item.quantity,
                finished: item.finished,
                productId: item.productId,
                productName: item.productName,
                value: item.value
            }));
        
            
            if (!orderItems.length)
                return PatternResponses.createError('noRegister', ['Order Item']);
            return {orderId, orderStatus, orderNumber, deliveryDate, totalValue, 
                deliveryCost, clientName, clientId, items: orderItems};
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError');
        }
    }

    static async createWithProducts(userId: number, orderId: number, products: any[], transaction: any): Promise<boolean | CustomError> {
        try {
            for (const product of products) {
                const productRecord = await Product.findOne({ where: { id: product.id, userId }, transaction });
                if (!productRecord) {
                    return PatternResponses.createError('invalid', ['product', "doesn't belong to the user"]);
                }
    
                const creation = await OrderItems.create({
                    orderId,
                    productId: product.id,
                    quantity: product.quantity,
                    value: product.value,
                }, { transaction });
    
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
   
    static async updateItems(orderId: number, data: OrderItemsAttributes[], transaction: Transaction) {
        try {
            const currentOrderItems = await OrderItems.findAll({
                where: { orderId },
                transaction
            });
    
            const currentProductIds = currentOrderItems.map(item => item.productId);
            const newProductIds = data.map(item => item.productId);
            const productIdsToDelete = currentProductIds.filter(id => !newProductIds.includes(id));
    
            if (productIdsToDelete.length > 0) {
                await OrderItems.destroy({
                    where: {
                        orderId,
                        productId: productIdsToDelete
                    },
                    transaction
                });
            }
    
            for (const item of data) {
                try {
                    const orderItem = await OrderItems.findOne({
                        where: { orderId, productId: item.productId },
                        transaction
                    });
    
                    if (!orderItem) {
                        const createOrderItem = await OrderItems.create({
                            orderId, quantity: item.quantity, finished: item.finished, value: item.value, productId: item.productId
                        }, {transaction})
                    }

                    const [rowsAffected] = await OrderItems.update({
                        quantity: item.quantity,
                        finished: item.finished,
                        value: item.value
                    }, {
                        where: { orderId, productId: item.productId },
                        transaction
                    });
                } catch (error: any) {
                    console.error(`Error during findOrCreate or update for productId ${item.productId}:`, error);
                    throw PatternResponses.createError('databaseError');
                }
            }
    
            return PatternResponses.createSuccess('updated', ['orderItems']);
        } catch (err) {
            await transaction.rollback();
            console.error('Transaction rollback due to error:', err);
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
    value: {
        type: DataTypes.FLOAT
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

OrderItems.addHook('beforeCreate', async (orderItem: any, { transaction }) => {
    try {
        const existingItem = await OrderItems.findOne({
            where: { productId: orderItem.productId, orderId: orderItem.orderId },
            transaction,
        });

        if (existingItem) throw PatternResponses.createError('alreadyExists', ['orderItem', 'product']);
    } catch (error: any) {
        console.error('Error in beforeCreate hook:', error);
        throw error;
    }
});

export default OrderItems;
