import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import Orders from "../models/Orders";
import { orderCreation, orderUpdateValidation } from "../validation/OrdersValidation";
import PatternResponses from "../utils/PatternResponses";
import { OrderItems } from "../repositories/OrderItems";

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

        const {error} = idValidation.validate(userId);
        if(error) return next({error: error.details[0].message})

        const orders = await Orders.findByUserIdAggregateProduct(parseInt(userId))
    }

    static async create(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        const {error} = orderCreation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 
        const {products, ...orderData} = data;

        if(!orderData.orderStatus) orderData.orderStatus = 0;

        const order = await Orders.create(orderData);
        if('error' in order) return res.json(PatternResponses.createError('notCreated', ['Order']))

        const orderItems = await OrderItems.createWithProducts(orderData.userId, order.id, products);

        // if(orderItems) {
        //     order.destroy()
        // }

        return res.json(order)
    }
    static async update(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const {id} = req.params

        const {error} = orderUpdateValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 

        const order = await Orders.update(data, {where: {id}});
        
        if(!order) return res.json(PatternResponses.createError('notUpdated', ['Order'])) 

        return res.json(PatternResponses.createSuccess('updated'))
    }
    static async delete(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;

        const {error} = idValidation.validate(id)
        if (error) return next({error: error.details[0].message})  

        const order = await Orders.findById(parseInt(id));

        if('error' in order) return next(order);

        order.destroy();
        return res.json(PatternResponses.createSuccess('deleted'))
    }
}