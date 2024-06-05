import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import Orders from "../models/Orders";
import { orderCreation, orderUpdateValidation } from "../validation/OrdersValidation";
import PatternResponses from "../utils/PatternResponses";
import OrderItems from "../models/OrderItems";
import Clients from "../models/Clients";
import { orderItemUpdateValidation } from "../validation/OrderItemsValidation";

export class OrderItemsController {
    static async getByOrderId(req: Request, res: Response, next: NextFunction){
        const {orderId} = req.params;

        const {error} = idValidation.validate(orderId)
        if (error){
            return next({error: error.details[0].message})
        } 

        const orderData = await OrderItems.findByOrderId(parseInt(orderId));

        if('error' in orderData) return next(orderData)
        return res.json(orderData)
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

    static async create(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        console.log(data)
        
        const {error} = orderCreation.validate(data)
        if (error){
            console.log(error)
            return next({error: error.details[0].message})
        } 
        const {products, ...orderData} = data;

        if(!orderData.orderStatus) orderData.orderStatus = 0;

        const isClientActive = await Clients.findById(data.clientId);
        if(('error' in isClientActive) || !isClientActive.active){
            return res.json(PatternResponses.createError('invalid', ['client', 'doesn\'t exist or is inactive']))
        }

        const order = await Orders.create(orderData);
        if('error' in order) return res.json(PatternResponses.createError('notCreated', ['Order']))


        const orderItems = await OrderItems.createWithProducts(orderData.userId, order.id, products);

        if(typeof orderItems == 'object' && 'error' in orderItems) {
            order.destroy();
            return res.json(orderItems)
        }

        return res.json(order)
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
    static async addProductToOrder(req: Request, res: Response, next: NextFunction){
        const {orderId} = req.params;
        const data = req.body;

        console.log(orderId)

        const {error} = orderItemUpdateValidation.validate(data);
        if (error) return next({error: error.details[0].message});

        try {
            const orderItem = await OrderItems.create({orderId, productId: data.productId, quantity: data.quantity, finished: false})
            if(!orderItem) return next(PatternResponses.createError('notCreated', ['OrderItem']));

            return res.json(orderItem)
        } catch (error) {
            console.error(error);
            return next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;

        const {error} = idValidation.validate(id)
        if (error) return next({error: error.details[0].message})  

        const order = await Orders.findById(parseInt(id));

        if('error' in order) return next(order);

        const orderItemsDelete = await OrderItems.destroyByOrderId(parseInt(id));
        if('error' in orderItemsDelete) return res.json(PatternResponses.createError('notDeleted', ['OrderItems']))

        const orderDelete = await Orders.destroy({where: {id}})
        if(!orderDelete) return res.json(PatternResponses.createError('notDeleted', ['Order']))

        return res.json(PatternResponses.createSuccess('deleted'))
    }
}