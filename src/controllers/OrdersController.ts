import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import Orders from "../models/Orders";
import { orderCreation, orderUpdateValidation } from "../validation/OrdersValidation";
import PatternResponses from "../utils/PatternResponses";
import OrderItems from "../models/OrderItems";
import Clients from "../models/Clients";
import { crossOriginResourcePolicy } from "helmet";

export class OrdersController {
    static async getAllByUserId(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        const {error} = idValidation.validate(userId)
        if (error){
            return next({error: error.details[0].message})
        } 

        const orders = await Orders.findByUserId(parseInt(userId));

        if('error' in orders) return next(orders)
        return res.json(orders)
    }

    static async getById(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;

        const {error} = idValidation.validate(id)
        if (error){
            return next({error: error.details[0].message})
        } 

        const client = await Orders.findById(parseInt(id));
        if('error' in client) return next(client)

        return res.json(client)

    }

    static async getAggregateProduct(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        console.log('oi')

        const {error} = idValidation.validate(userId);
        if(error) return next({error: error.details[0].message})

        const orders = await Orders.findByUserIdAggregateProduct(parseInt(userId));
        if('error' in orders) return next(orders);
       
        res.json(orders)
    }

    
    static async create(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        const { error } = orderCreation.validate(data);
        if (error) {
            console.log(error);
            return next({ error: error.details[0].message });
        }
        const { products, ...orderData } = data;

        if(!orderData.value) {
            const value = products.reduce((a: number, b: any)=>(a + (b.value * b.quantity)), 0);
            console.log('value', value)
            orderData.value = value
        }
        if (!orderData.orderStatus) orderData.orderStatus = 0;

        const isClientActive = await Clients.findById(data.clientId);
        
        if ('error' in isClientActive || !isClientActive.active) {
            return next(PatternResponses.createError('invalid', ['client', "doesn't exist or is inactive"]));
        }

        if(isClientActive.userId !== data.userId) {
            return next(PatternResponses.createError('invalid', ['clientId', 'belongs to another user']))
        }

        const order = await Orders.createOrder(orderData, products);
        if ('error' in order) return next(order);

        return res.json(order);
    }

    static async update(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const {id} = req.params

        const {error} = orderUpdateValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 

        const order = await Orders.findById(parseInt(id))
        
        if('error' in order) return res.json(order)
        const orderUpdate = await Orders.update(data, {where: {id}});

        const [rowsAffected] = orderUpdate;
        console.log(rowsAffected)

        if(rowsAffected === 0) return res.json(PatternResponses.createError('notUpdated', ['Order'])) 

        return res.json(PatternResponses.createSuccess('updated'))
    }
    static async delete(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;

        const {error} = idValidation.validate(id)
        if (error) return next({error: error.details[0].message})  

        const order = await Orders.findById(parseInt(id));

        if('error' in order) return next(order);

        const orderItemsDelete = await OrderItems.destroyByOrderId(parseInt(id));
        if('error' in orderItemsDelete) return next(PatternResponses.createError('notDeleted', ['OrderItems']))

        const orderDelete = await Orders.destroy({where: {id}})
        if(!orderDelete) return next(PatternResponses.createError('notDeleted', ['Order']))

        return res.json(PatternResponses.createSuccess('deleted'))
    }
}