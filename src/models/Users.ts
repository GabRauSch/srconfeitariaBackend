import sequelize from "../config/mysql";
import { Model, DataTypes, QueryTypes, Op, Transaction, QueryOptionsTransactionRequired, where } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { userPermission } from "../mapping/userPermission";
import PlanPayments from "./PlanPayments";
import { addMonths } from "date-fns";
import Plans from "./Plans";
import { generateRefferalCode } from "../utils/generator";
import PlanDiscounts, { DiscountData } from "./PlanDiscounts";
import ApplicableDiscounts from "./ApplicableDisocunts";

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
    acceptedTerms: boolean,
    refferalCode: string
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

type AnalyticsData = {id?: string, title: string, value: number, format: string, displayColor: 'positive' |'negative' |'neutral'}

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
    public refferalCode!: string;

    static async findById(userId: number){
        try {
            const query = `
            SELECT u.id, u.planId, u.name, u.email, u.acceptedTerms, u.phone, u.userPermission, 
                pp.dueDate, pp.paymentDate FROM users u
            LEFT JOIN planpayments	pp ON u.id = pp.userId
            WHERE u.id = :userId
            ORDER BY paymentDate LIMIT 1`
            const user = await sequelize.query(query, {
                replacements: {userId},
                type: QueryTypes.SELECT
            })
            if(!user.length) return PatternResponses.createError('noRegister', ['user'])
            return user[0]
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
    static async getResults(userId: number): Promise<AnalyticsData[] | CustomError>{
        try {
            const query = `
            SELECT
                (SELECT COALESCE(SUM(Orders.value), 0)
                FROM Orders
                WHERE Orders.userId = :userId
                AND MONTH(Orders.deliveryDate) = MONTH(NOW()) 
                AND YEAR(Orders.deliveryDate) = YEAR(NOW())) AS invoice,

                (SELECT COALESCE(COUNT(*), 0)
                FROM Orders
                WHERE Orders.userId = :userId
                AND MONTH(Orders.deliveryDate) = MONTH(NOW()) 
                AND YEAR(Orders.deliveryDate) = YEAR(NOW())) AS sales,

                (SELECT COALESCE(SUM(Products.productionCost * OrderItems.quantity), 0)
                FROM OrderItems
                INNER JOIN Products ON OrderItems.productId = Products.id
                INNER JOIN Orders ON OrderItems.orderId = Orders.id
                WHERE Orders.userId = :userId
                AND MONTH(Orders.deliveryDate) = MONTH(NOW()) 
                AND YEAR(Orders.deliveryDate) = YEAR(NOW())) AS totalCosts,

                (SELECT COALESCE(COUNT(*), 0)
                FROM Orders
                WHERE Orders.userId = :userId
                AND Orders.orderStatus != 2) AS pendentOrders,

                (SELECT COALESCE(COUNT(*), 0)
                FROM Orders
                WHERE Orders.userId = :userId
                AND Orders.delivered IS NULL) AS pendentDeliveries,

                (SELECT COALESCE(COUNT(DISTINCT id), 0)
                    FROM Clients
                    WHERE userId = 1
                    AND MONTH(createdAt) = MONTH(NOW()) 
                    AND YEAR(createdAt) = YEAR(NOW())) AS newClients,

                (SELECT COALESCE(COUNT(*), 0)
                FROM OrderPayments
                INNER JOIN Orders ON OrderPayments.orderId = Orders.id
                WHERE Orders.userId = :userId
                AND OrderPayments.paymentDate IS NULL) AS pendentPayments;
            `;
            const data: any = await sequelize.query(query, {
                replacements: {userId},
                type: QueryTypes.SELECT
            })

            if(!data) return PatternResponses.createError('noRegister', ['analytic'])
            const {invoice,totalCosts, sales, pendentOrders, pendentDeliveries, pendentPayments, newClients } = data[0];

            const profit = parseFloat(invoice) - parseFloat(totalCosts);
            const profitDisplayColor = profit > 0 ? ('positive') : (profit == 0 ? 'neutral': 'negative')
            const formatedData: AnalyticsData[] = [
                {title: 'Faturamento', value: parseFloat(invoice), format: 'currency' , displayColor: 'positive'},
                {title: 'Custos', value: parseFloat(totalCosts), format: 'currency', displayColor: 'negative'},
                {title: 'Lucro', value: profit, format: 'currency', displayColor: profitDisplayColor},
                {title: 'Pedidos Pendentes', value: parseInt(pendentOrders), format: 'count' , displayColor: 'neutral'},
                {title: 'Entregas Pendentes', value: parseInt(pendentDeliveries), format: 'count' , displayColor: 'neutral'},
                {title: 'Pagamentos Pendentes', value: parseInt(pendentPayments), format: 'count' , displayColor: 'negative'},
                {title: 'Vendas', value: parseInt(sales), format: 'count' , displayColor: 'neutral'},
                {title: 'Novos Clientes', value: parseInt(newClients), format: 'operation' , displayColor: 'neutral'},
            ];
            formatedData.forEach((el, key)=>{
                el.id = (key + 1).toString();
            })

            return formatedData
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
    static async findByName(name: string, transaction: Transaction): Promise<Users | CustomError>{
        try {
            const user = await Users.findOne({
                where: {name},
                transaction
            })

            if(!user) return PatternResponses.createError('noRegister', ['user']);
            return user
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

            console.log('creation', creation)
            if(!creation) return PatternResponses.createError('notCreated', ['user']);
            return creation
        } catch(e) {
            console.log('ue', e)
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

    static async findRefferalCode(userId: number): Promise<{refferalCode: string} | CustomError>{
        try {
            const user = await Users.findByPk(userId);
            if(!user) return PatternResponses.createError('noRegister', ['user']); 
            const refferalCode = user.refferalCode
            return {refferalCode}
        } catch (error) {
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
    },
    refferalCode: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: true
});

Users.addHook('afterFind', async (result: any, { transaction }) => {
    if(!result) return
    try {
        const payment = await PlanPayments.findOne({where: {userId: result.id}, order: [['dueDate', 'desc']]});
        if(payment && payment.paymentDate){
            const plan = await Plans.findOne({where: {id: payment.planId}});
            if(!plan) throw PatternResponses.createError('internalServerError')
            const data = {
                userId: payment.userId,
                planId: payment.planId,
                dueDate: addMonths(payment.dueDate, 1),
                value: plan.planValue
            }
            const newPayments = await PlanPayments.create(data);
            if(!newPayments) throw PatternResponses.createError('notCreated', ['payment'])
        }
        if(!payment && (new Date().getTime() - new Date(result.createdAt).getTime()) >= (30 * 24 * 60 * 60 * 1000)){
            const plan = await Plans.findOne({where: {id: result.planId}});
            if(!plan) throw PatternResponses.createError('internalServerError')
            const data = {
                userId: result.userId,
                planId: result.planId,
                dueDate: addMonths(result.dueDate, 1),
                value: plan.planValue
            }
            const newPayments = await PlanPayments.create(data);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
});


Users.addHook('afterCreate', async (result: any, {transaction})=>{
    try {
        const refferalCode = generateRefferalCode(result);
        result.refferalCode = refferalCode;
        await result.save({ transaction });

        const discount = await ApplicableDiscounts.findByDescription('Código de confeiteira', transaction as Transaction);
        if('error' in discount) throw discount;

        const data: DiscountData = {
            code: refferalCode, 
            userId: result.id, 
            applicableDiscountId: discount.id,
            amount: discount.amount
        }
        await PlanDiscounts.createDiscount(data, transaction as Transaction)        
    } catch (error) {
        console.error(error);
        throw error;
    }
})

export default Users