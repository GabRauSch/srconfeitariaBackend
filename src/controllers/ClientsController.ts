import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import { clientCreationValidation, clientUpdateValidation } from "../validation/ClientsValidation";
import PatternResponses from "../utils/PatternResponses";
import Clients from "../models/Clients";
import Orders from "../models/Orders";

export class ClientsController {
    static async getAllByUserId(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        const {error} = idValidation.validate(userId)
        if (error){
            return next({error: error.details[0].message})
        } 

        const clients = await Clients.findByUserId(parseInt(userId));

        if('error' in clients) return next(clients)
        
        return res.json(clients)
    }

    static async getById(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;

        const {error} = idValidation.validate(id)
        if (error){
            return next({error: error.details[0].message})
        } 

        const client = await Clients.findById(parseInt(id));
        if('error' in client) return next(client)

        return res.json(client)

    }

    static async create(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        
        const {error} = clientCreationValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 
        
        const clientExists = await Clients.findByName(data.userId, data.name);
        if(!('error' in clientExists)) 
            return res.json(PatternResponses.createError('alreadyExists', ['client', 'name']))

        console.log(data)
        const client = await Clients.create(data);
        
        if(!client) return res.json(PatternResponses.createError('notCreated', ['Client']))
        
        return res.json(client)
    }
    static async update(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const {id} = req.params

        const {error} = clientUpdateValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 

        const client = await Clients.update(data, {where: {id}});
        
        if(!client) return res.json(PatternResponses.createError('notUpdated', ['Client'])) 

        return res.json(PatternResponses.createSuccess('updated'))
    }
    static async delete(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;

        const {error} = idValidation.validate(id)
        if (error) return next({error: error.details[0].message})  

        const client = await Clients.findById(parseInt(id));
        if('error' in client) return next(client);

        const orders = await Orders.findByClientId(parseInt(id))

        if(!('error' in orders) && orders.length > 0){
            try {
                await Clients.update({active: false}, {where: {id}})
            } catch (error) {
                console.error(error)
                return next(PatternResponses.createError('notUpdated'))
            }

            return res.json(PatternResponses.createSuccess('deleted'))
        } 

        client.destroy();
        return res.json(PatternResponses.createSuccess('deleted'))
    }
}