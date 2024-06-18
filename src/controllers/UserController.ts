import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import { productCreation, productUpdateValidation } from "../validation/ProductsValidation";
import PatternResponses from "../utils/PatternResponses";
import Products from "../models/Products";
import Categories from "../models/Categories";
import { errorKey } from "../mapping/errors";
import Users from "../models/Users";
import { updateUserValidation } from "../validation/UserValidation";

export class UserController {
    static async getById(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        const {error} = idValidation.validate(userId)
        if (error){
            return next({error: error.details[0].message})
        } 

        const client = await Users.findById(parseInt(userId));
        if('error' in client) return next(client)

        return res.json(client)

    }
    static async update(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;
        const data = req.body

        const id = idValidation.validate(userId)
        if (id.error){
            return next({error: id.error.details[0].message})
        } 

        const {error} = updateUserValidation.validate(data)
        if(error){
            return next({error: error.details[0].message})
        }

        const client = await Users.updateUser(parseInt(userId), data);
        if('error' in client) return next(client)

        return res.json(client)
    }

}