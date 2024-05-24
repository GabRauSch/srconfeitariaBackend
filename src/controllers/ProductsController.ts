import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import { productCreation, productUpdateValidation } from "../validation/ProductsValidation";
import PatternResponses from "../utils/PatternResponses";
import Products from "../models/Products";
import Categories from "../models/Categories";
import { errorKey } from "../mapping/errors";

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

        if(data.categoryData){
            try {
                const category = await Categories.create({description: data.categoryData.description, userId: data.userId});
                data.categoryId = category.id
            } catch (error) {
                if('message' in (error as any) && (error as any).message == 'alreadyExists') 
                    return next(PatternResponses.createError((error as any).message as errorKey, ['Category', 'description']))
                return next(error);
            }
        }

        const product = await Products.create(data);
        
        if(!product) return res.json(PatternResponses.createError('notCreated', ['Product']))
        
        return res.json(product)
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const { id } = req.params;
    
        const { error } = productUpdateValidation.validate(data);
        if (error) {
            return next({ error: error.details[0].message });
        }
    
        try {
            const product = await Products.findByPk(id);
            if (!product) {
                return res.json(PatternResponses.createError('noRegister', ['product']));
            }
    
            let category;
            if (data.categoryData) {
                category = await Categories.create({ userId: product.userId, description: data.categoryData.description });
            }
    
            const [rowsAffected] = await Products.update(data, { where: { id } });
            if (rowsAffected === 0) {
                return res.json(PatternResponses.createError('notUpdated', ['Product']));
            }
    
            const response: any = {
                name: product.name
            }
            if(category) response.category = {id: category.id, description: category.description}

            return res.json(response);
        } catch (error) {
            console.error(error);
            return next({ error: 'An error occurred while updating the product.' });
        }
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