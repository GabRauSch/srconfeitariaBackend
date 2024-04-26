import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/mysql";
import { Clients } from "../repositories/Clients";
import { Categories } from "../repositories/Categories";

Categories.init({
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
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Categories',
    tableName: 'categories',
    timestamps: true
});

export default Categories;
