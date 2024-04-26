import { DataTypes, Model, Order, QueryTypes } from "sequelize";
import {Users}  from "../repositories/Users";
import {Clients} from "../repositories/Clients";
import sequelize from "../config/mysql";
import { OrderStatus } from "../mapping/orderStatus";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

export interface OrderAttributes {
    id: number,
    userId: number,
    clientId: number,
    orderNumber: number,
    deliveryDate: Date,
    value: number,
    deliveryCost: number,
    delivered: Date,
    orderStatus: OrderStatus 
}

export class Orders extends Model implements OrderAttributes {
    public id!: number;
    public userId!: number;
    public clientId!: number;
    public orderNumber!: number;
    public deliveryDate!: Date;
    public value!: number;
    public deliveryCost!: number;
    public orderStatus!: OrderStatus;
    public delivered!: Date;

    static async findByUserId(userId: number): Promise<Orders[] | CustomError> {
        try {
            const query = 
            `SELECT 
                CASE
                    WHEN DATE(o.deliveryDate) = CURDATE() THEN 'Hoje'
                    WHEN DATE(o.deliveryDate) = CURDATE() + INTERVAL 1 DAY THEN 'Amanhã'
                    ELSE DATE_FORMAT(o.deliveryDate, '%d/%m')
                END AS deliveryDay, 
                o.orderStatus, SUM(o.value) AS total, c.id, c.name,
                GROUP_CONCAT(DISTINCT p.name) AS itens
            FROM orders o
                JOIN clients c ON c.id = o.clientId
                JOIN orderitems oi ON oi.orderId = o.id
                JOIN products p ON p.id = oi.productId
            WHERE o.userId = :userId
            GROUP BY deliveryDay, o.orderStatus, c.id, c.name
            ORDER BY deliveryDay;`
            const orderItems: Orders[] = await sequelize.query(query, {
                replacements: {userId},
                type: QueryTypes.SELECT
            })
            return orderItems;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async findById(id: number): Promise<Orders | CustomError> {
        try {
            const order = await Orders.findByPk(id);
            if (!order) 
                return PatternResponses.createError('noRegisterWithId', ["order", id]);

            return order;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }

    static async findByUserIdAggregateProduct(userId: number): Promise<Orders[] | CustomError>{
        try {
            const query = 
            `SELECT p.name, sum(oi.quantity) AS quantity
                FROM orders o
                LEFT JOIN orderitems oi ON oi.orderId = o.id
                JOIN products p ON p.id = oi.productId
            WHERE o.userId = :userId
                GROUP BY p.id`

            const orders: Orders[] = await sequelize.query(query,{
                replacements: {userId},
                type: QueryTypes.SELECT
            });
            if (!orders) 
                return PatternResponses.createError('noRegister');

            return orders;
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}

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
        allowNull: true
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

Orders.addHook('beforeCreate', async (order: any, { transaction }) => {
    try {
      const lastOrder = await Orders.findOne({
        where: { userId: order.userId },
        order: [['createdAt', 'DESC']],
        transaction,
      });
  
      (order as OrderAttributes).orderNumber = (lastOrder?.orderNumber ?? 0) + 1;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  });
export default Orders