import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import { Clients } from "../repositories/Clients";

export class ClientsController {
    static async getAllByStoreId(req: Request, res: Response, next: NextFunction){
        const {storeId} = req.params;

        const {error} = idValidation.validate(storeId)
        if (error){
            return next({error: error.details[0].message})
        } 

        const clients = await Clients.findByStoreId(parseInt(storeId));
        if('error' in clients) return next(clients)
        return res.json(clients)
    }

    static async getById(req: Request, res: Response){

    }

    static async create(req: Request, res: Response){

    }
    static async update(req: Request, res: Response){

    }
    static async delete(req: Request, res: Response){

    }
}