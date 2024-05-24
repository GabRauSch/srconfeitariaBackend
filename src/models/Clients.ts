import { DataTypes, Model, Optional, QueryTypes, Sequelize } from "sequelize";
import sequelize from "../config/mysql";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { Location } from "../types/Location";

export interface ClientsAttributes {
    id: number;
    userId: number;
    name: string;
    phone: string;
    email: string;
    birthday: Date;
    postalCode: number;
    local: Location;
    active: boolean
}
export interface ClientsCreation extends Optional<Clients, 'id'> {}


export class Clients extends Model implements ClientsAttributes{
    public id!: number;
    public userId!: number;
    public name!: string;
    public phone!: string;
    public email!: string;
    public local!: Location;
    public birthday!: Date;
    public postalCode!: number;
    public permission!: number;
    public active!: boolean;


    static async findByUserId(userId: number): Promise<Clients[] | CustomError> {
        try {
            const query = `SELECT c.id, 
            name, 
            MIN(CASE WHEN o.orderStatus IN (0, 1) THEN o.deliveryDate END) AS nextDeliveryDate,
            CASE WHEN phone IS NULL THEN 'Número não cadastrado' 
                 ELSE phone END AS phone, 
            COUNT(CASE WHEN o.orderStatus = 1 THEN o.id END) AS orderCount, 
            CASE WHEN SUM(CASE WHEN o.orderStatus = 1 THEN o.value ELSE 0 END) IS NULL THEN 0 
                 ELSE CAST(SUM(CASE WHEN o.orderStatus = 1 THEN o.value ELSE 0 END) AS FLOAT) END AS totalOrderValue
            FROM clients c
            LEFT JOIN orders o ON o.clientId = c.id
            WHERE c.userId = :userId AND c.active = true
            GROUP BY c.id, name;`
            const clients: any[] = await sequelize.query(query, {
                replacements: {userId},
                type: QueryTypes.SELECT
            });
            if (clients.length === 0) 
                return PatternResponses.createError('noRegister', ["clients"]);

            return clients
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError');
        }
    }
    static async findByName(userId: number, name: string): Promise<Clients[] | CustomError> {
        try {
            const clients = await Clients.findAll({ where: { userId, name } });
            if (clients.length === 0) 
                return PatternResponses.createError('noRegister', ["clients"]);

            return clients;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError');
        }
    }
    static async findById(id: number): Promise<Clients | CustomError> {
        try {
            const client = await Clients.findByPk(id);
            if (!client) 
                return PatternResponses.createError('noRegisterWithId', ["client", id]);

            return client;
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
}


Clients.init({
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    birthday: {
        type: DataTypes.DATE,
    },
    postalCode: {
        type: DataTypes.INTEGER,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'Clients',
    tableName: 'clients',
    timestamps: true
});

export default Clients;
