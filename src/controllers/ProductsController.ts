import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import { Products } from "../repositories/Products";
import { productCreation, productUpdateValidation } from "../validation/ProductsValidation";
import PatternResponses from "../utils/PatternResponses";

export class ProductsController {
    static async getAllByUserId(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        const {error} = idValidation.validate(userId)
        if (error){
            return next({error: error.details[0].message})
        } 

        const products = await Products.findByUserId(parseInt(userId));

        if('error' in products) return next(products)
        return res.json(products)
    }

    static async getById(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;

        const {error} = idValidation.validate(id)
        if (error){
            return next({error: error.details[0].message})
        } 

        const client = await Products.findById(parseInt(id));
        if('error' in client) return next(client)

        return res.json(client)

    }

    static async create(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        const {error} = productCreation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 

        const product = await Products.create(data);
        
        if(!product) return res.json(PatternResponses.createError('notCreated', ['Product']))
        
        return res.json(product)
    }
    static async update(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const {id} = req.params

        const {error} = productUpdateValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 

        const product = await Products.update(data, {where: {id}});
        
        if(!product) return res.json(PatternResponses.createError('notUpdated', ['Product'])) 

        return res.json(PatternResponses.createSuccess('updated'))
    }
    static async delete(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;

        const {error} = idValidation.validate(id)
        if (error) return next({error: error.details[0].message})  

        const product = await Products.findById(parseInt(id));

        if('error' in product) return next(product);

        product.destroy();
        return res.json(PatternResponses.createSuccess('deleted'))
    }
}