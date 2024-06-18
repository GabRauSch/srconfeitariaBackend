import sequelize from "../config/mysql";
import { Model, DataTypes, QueryTypes, Op, Transaction, QueryOptionsTransactionRequired } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { userPermission } from "../mapping/userPermission";

export interface UserAttributes {
    id: number,
    planId: number,
    name: string,
    email: string,
    passwordHash: string,
    confirmationCode: string,
    active: boolean,
    phone: string,
    userPermission: userPermission,
    acceptedTerms: boolean
}
type UserCreation = {
    name: string,
    email: string,
    password: string,
    confirmationCode: string,
    phone?: string,
    userPermission?: 0 | 1,
    acceptedTerms: boolean
}
type PendentPayments = {
    id: number,
    name: string,
    active: boolean,
    planId: number,
    planValue: number,
    description: string,
    durationDays: number,
    date: Date,
    value: number
}
type ReturnCause = {
    return: boolean,
    cause?: any
}
type success = {
    success: boolean
}
export class Users extends Model implements UserAttributes{
    public id!: number;
    public planId!: number;
    public name!: string;
    public email!: string;
    public passwordHash!: string;
    public confirmationCode!: string;
    public active!: boolean;
    public phone!: string;
    public userPermission!: userPermission;
    public acceptedTerms!: boolean;

    static async findById(userId: number){
        try {
            const user = await Users.findByPk(userId, {attributes: ['id', 'name','acceptedTerms', 'email', 'planId', 'phone', 'userPermission']})
            if(!user) return PatternResponses.createError('noRegister', ['user'])
            return user
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }

    static async updateUser(userId: number, data: UserAttributes){
        try {
            const [rowsAffected] = await Users.update(data, {where: {id: userId}})
            if(rowsAffected == 0) return PatternResponses.createError('notUpdated', ['user'])
            return PatternResponses.createSuccess('updated', ['user'])
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }

    static async userByConfirmationCodeAndEmail(confirmationCode: string, email: string, transaction: Transaction): Promise<Users | CustomError>{
        try {
            const user = await Users.findOne({
                where: { confirmationCode, email },
                transaction
            });
            if(!user) return PatternResponses.createError('invalidAttributes', ['email e/ou confirmationCode'])
            return user
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }

    static async toggleActivation(userId: number): Promise<success | CustomError>{
        try {
            const query = `UPDATE Users SET active = NOT active WHERE id = :userId`;
            const [rowsAffected, other] = await sequelize.query(query, {
                replacements: {userId},
                type: QueryTypes.UPDATE,
            });
            console.log(rowsAffected, other)
            if(rowsAffected == 0) return PatternResponses.createError('notUpdated', ['user active'])
            return {success: true} 
        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async nameTaken(name: string, transaction: Transaction): Promise<boolean | CustomError>{
        try {
            const user = await Users.findOne({
                where: {name},
                transaction
            })
            if(user) return true
            return false
        } catch (error) {
            console.error(error)
            return PatternResponses.createError('databaseError')
        }
    }
    static async userExists(email: string, name: string, transaction: Transaction): Promise<Users | CustomError>{
        try {
            const user = await Users.findOne({
                where: {
                    [Op.and]: {
                        active: true,
                        [Op.or]: {
                            name,
                            email
                        }
                    }
                },
                transaction
            })
            if(!user) return PatternResponses.createError('noRegister', ['user'])
            return user
        } catch (error) {
            console.error(error)
            return PatternResponses.createError('databaseError')
        }
    }
    static async confirmCreation(userUpdate: Users, transaction: Transaction): Promise<any | CustomError>{
        try {
            
            const updatedUser = await userUpdate.update({
                confirmationCode: '',
                active: true,
            }, {transaction});

            if(!updatedUser) return PatternResponses.createError('notCreated', ['user'])
            
            const data = {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email
            }

            return data
        } catch (e) {
            console.error(e);
            return PatternResponses.createError('databaseError')
        }
    }

    static async userByEmail(email: string, transaction: Transaction): Promise<Users | CustomError>{
        try {
            const user = await Users.findOne({where: {email}, transaction})
            if(!user) return PatternResponses.createError('noRegister', ['user'])
            return user
        } catch (e) {
            console.error(e);
            return PatternResponses.createError('databaseError')
        }
    }
    static async createTemporaryUser(data: UserCreation, transaction: Transaction): Promise<Users | CustomError> {
        try {
            const creation = await Users.create(data, {
                returning: true,
                transaction
            })

            if(!creation) return PatternResponses.createError('notCreated', ['user'])
            return creation
        } catch(e) {
            console.log(e)
            return PatternResponses.createError('databaseError')
        }
    }
    static async getUserByEmailAndPasswordHash(email: string, passwordHash: string): Promise<Users | CustomError>{
        try {
            const user = await Users.findOne({where: {email, passwordHash}})
            if(!user) return PatternResponses.createError('loginFailed');
            return user
        } catch (e) {
            console.error(e);
            return PatternResponses.createError('noRegister', ['users'])
        }
    }

    static async getPendentPlanPaymentUsers(userId: number): Promise<PendentPayments[] | CustomError>{
        try {
            const query = `
            SELECT u.id, u.planId, u.name, u.active, p.planValue, p.description, p.durationDays, pp.date, pp.value 
            FROM users u
                JOIN plans p ON p.id = u.planId
                JOIN planpayments pp ON pp.planId = p.id`
            const data: PendentPayments[] = await sequelize.query(query, {
                type: QueryTypes.SELECT
            })
            if(!data) return PatternResponses.createError('noRegister', ['pendentPayments'])
            return data;
        } catch (error) {
            return PatternResponses.createError('databaseError')
        }
    }
    
    // static async updateUserInfo(userId: number, data: UserUpdateData): Promise<boolean>{
    //     try {
    //         const columns = Object.keys(data);
    //         const values = Object.values(data);

    //         const setClause = columns.map((col, index) => `${col} = ?`).join(', ');
    //         console.log(setClause)
    //         const rawQuery = `
    //         UPDATE users 
    //         SET ${setClause} 
    //         WHERE id = ?
    //         `;

    //         const userUpdate = await sequelize.query(rawQuery, {
    //         replacements: [...values, userId],
    //         type: QueryTypes.UPDATE
    //         });

    //         return userUpdate ? true : false
    //     } catch (e) {
    //         console.error(e);
    //         return false
    //     }
    // }
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Plans',
            key: 'id'
        }
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmationCode: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userPermission: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    timestamps: true
});

export default Users