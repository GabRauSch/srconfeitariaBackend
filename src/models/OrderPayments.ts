import sequelize from "../config/mysql";
import { DataTypes, Optional, QueryTypes } from "sequelize";
import { Model } from "sequelize";
import { CustomError } from "../types/ErrorType";
import PatternResponses from "../utils/PatternResponses";
import { addMonths, constructNow } from 'date-fns';
import { customSuccess } from "../types/SuccessType";

type selectedPayment = 0 | 1 | 2
const selectedPaymentMap = ['À vista', 'Parcelado', 'Independentes']

export interface OrderPaymentsAttributes {
    id: number,
    orderId: number,
    value: number,
    dueDate: Date,
    paymentDay: Date,
    selectedPayment: number
}

type payment = {
    paymentValue: number,
    paidValue: number,
    dueDate: Date
}
type OrderPayment = {
    id: number,
    name: string,
    orderValue: number,
    selectedPayment: number
    payments: payment[]
}

export interface OrderPaymentCreationAttributes extends Optional<OrderPayments, 'id'> {}

export class OrderPayments extends Model implements OrderPaymentsAttributes{
    public id!: number;
    public orderId!: number;
    public value!: number;
    public dueDate!: Date;
    public paymentDay!: Date;
    public selectedPayment!: number;

    static async findByOrderId(orderId: number): Promise<OrderPayment | CustomError> {
        try {
            const query = `
            SELECT o.id, c.name, o.value AS orderValue, op.value AS paymentValue, op.selectedPayment,
            op.id AS paymentId, op.paidValue, op.dueDate FROM orders o
                left JOIN orderpayments op ON o.id = op.orderId
                JOIN clients c ON o.clientId = c.id
            WHERE o.id = :orderId`;  
            const data: any[] = await sequelize.query(query, {
                replacements: {orderId},
                type: QueryTypes.SELECT
            })

            if(data.length == 0) return PatternResponses.createError('noRegister', ['orderPayment'])
            const {name, id, orderValue, selectedPayment} = data[0]
            
            const paymentsData: payment[] = data[0].paymentValue === null ? [] : data.map(item => ({
                paymentValue: item.paymentValue,
                paidValue: item.paidValue,
                dueDate: item.dueDate,
                paymentId: item.paymentId
            }));

            return {name, id, orderValue, selectedPayment, payments: paymentsData};
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }

    static async findByUserId(userId: number): Promise<OrderPayment[] | CustomError>{
        try {
            const query = `
              	SELECT c.name, p.id, p.value, p.dueDate FROM orderpayments p 
                    JOIN orders o ON p.orderId = o.id
                    JOIN clients c ON c.id = o.clientId
                WHERE o.userId = :userId AND p.paidValue IS NULL`;  
            const data: any[] = await sequelize.query(query, {
                replacements: {userId},
                type: QueryTypes.SELECT
            })

            if(data.length == 0) return PatternResponses.createError('noRegister', ['orderPayment'])
            return data
        } catch (error: any) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async createOrderPayment(data: any): Promise<customSuccess | CustomError>{
        try {
            const transaction = await sequelize.transaction();
            const query = 
            `SELECT
                COALESCE(SUM(op.value), 0) AS paidSum, 
                COALESCE(o.value, 0) AS value FROM orders o
                left JOIN orderpayments op ON o.id = op.orderId
            WHERE o.id = :orderId`
            const payments: any = await sequelize.query(query, {
                replacements: {orderId: data.orderId},
                type: QueryTypes.SELECT,
                transaction
            })

            const inputValue = data.payments.map((el: any)=>{
                const installments = el.installments ? el.installments : 1
                return el.value * installments
            }).reduce((a: any, b: any)=>a+b)

            const exceeds = payments[0].paidSum + inputValue > payments[0].value;
            console.log(payments[0].paidSum, inputValue, payments[0].value)

            if(payments[0].paidSum + inputValue > payments[0].value ) return PatternResponses.createError('invalid', ['payment', 'exceeds the payment due'])
            
                for(const item of data.payments){
                    const installments = item.installments ? item.installments : 1
                    for(let i = 0; i < installments; i++){
                        const dueDate = addMonths(new Date(item.dueDate), i);
                        const creation = await OrderPayments.create({
                            orderId: data.orderId,
                            value: item.value,
                            dueDate: dueDate,
                            selectedPayment: data.selectedPayment
                        },
                        {transaction})
                        if(!creation) {
                            transaction.rollback()
                            return PatternResponses.createError('notCreated', ['orderPayment'])
                        }
                    }
                }
            transaction.commit()
            return PatternResponses.createSuccess('created', ['orderPayments'])

        } catch (error) {
            console.error(error);
            return PatternResponses.createError('databaseError')
        }
    }
    static async deleteById(orderId: number){
        try {
            const item = await OrderPayments.destroy({where: {orderId}});

            if(!item) return PatternResponses.createError('notDeleted', ['orderPayments']);;
            return PatternResponses.createSuccess('deleted', ['orderPayments'])
        } catch (error) {
            console.error(error)
            return PatternResponses.createError('notDeleted', ['orderPayments'])
        }
    }
}

OrderPayments.init({
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
    value: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    paidValue: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    selectedPayment: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: 'OrderPayments',
    tableName: 'orderPayments',
    timestamps: false
});

export default OrderPayments