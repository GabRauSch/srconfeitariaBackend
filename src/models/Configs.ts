import { DataTypes } from "sequelize";
import sequelize from "../config/mysql";
import { Configs } from "../repositories/Configs";

Configs.init({
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
    toleranceDays: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Config',
    tableName: 'config',
    timestamps: false
});

export default Configs