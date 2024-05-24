import sequelize from "../config/mysql";
import { Model, DataTypes } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { userPermission } from "../mapping/userPermission";

export interface UserAttributes {
    id: number,
    planId: number,
    name: string,
    email: string,
    passwordHash: string,
    active: boolean,
    phone: string,
    userPermission: userPermission,
    acceptedTerms: boolean
}

export class Users extends Model implements UserAttributes{
    public id!: number;
    public planId!: number;
    public name!: string;
    public email!: string;
    public passwordHash!: string;
    public active!: boolean;
    public phone!: string;
    public userPermission!: userPermission;
    public acceptedTerms!: boolean;

    static async findByOrderId(orderId: number): Promise<Users[] | CustomError> {
        try {
            const orderItems = await Users.findAll({ where: { orderId } });
            if (!orderItems.length)
                return PatternResponses.createError('noRegister');

            return orderItems;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Plans',
            key: 'id'
        }
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userPermission: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    acceptedTerms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: false
});

export default Users