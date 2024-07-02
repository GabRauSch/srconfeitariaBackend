import sequelize from "../config/mysql";
import { Model, DataTypes, QueryTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";

export interface ProductAttributes {
    id: number,
    userId: number,
    categoryId: number,
    name: string
    description: string,
    size: string,
    format: string,
    weight: number,
    value: string,
    productionCost: string,
    photo: string,
}

export class Products extends Model implements ProductAttributes{
    public id!: number;
    public userId!: number;
    public categoryId!: number;
    public name!: string;
    public description!: string;
    public size!: string;
    public format!: string;
    public weight!: number;
    public value!: string;
    public productionCost!: string;
    public photo!: string;

    static async findByOrderId(orderId: number): Promise<Products[] | CustomError> {
        try {
            const orderItems = await Products.findAll({ where: { orderId } });
            if (!orderItems.length)
                return PatternResponses.createError('noRegister');

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async findByUserId(userId: number): Promise<Products[] | CustomError> {
        try {
            const query = `SELECT p.id, p.name, p.description, 
            p.value,
            p.productionCost, c.id as categoryId,
            p.productionCost
            FROM products p
            JOIN categories c on c.id = p.categoryId
            WHERE p.userId = :userId`;

            const products: Products[] = await sequelize.query(query, {
                replacements: {userId},
                type: QueryTypes.SELECT
            })
            if (!products)
                return PatternResponses.createError('noRegister');

            return products;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async findById(id: number): Promise<Products | CustomError> {
        try {
            const product = await Products.findByPk(id);
            if (!product) 
                return PatternResponses.createError('noRegisterWithId', ["product", id]);

            return product;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}

Products.init({
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
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true
    },
    format: {
        type: DataTypes.STRING,
        allowNull: true
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productionCost: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Products',
    tableName: 'products',
    timestamps: true
});

export default Products