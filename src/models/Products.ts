import { DataTypes } from "sequelize";
import { Products } from "../repositories/Products";
import sequelize from "../config/mysql";

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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productionCost: {
        type: DataTypes.INTEGER,
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