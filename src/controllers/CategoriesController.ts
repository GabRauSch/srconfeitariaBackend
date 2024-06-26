import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import { clientCreationValidation, clientUpdateValidation } from "../validation/ClientsValidation";
import PatternResponses from "../utils/PatternResponses";
import Clients from "../models/Clients";
import Categories from "../models/Categories";
import { categoryCreation, categoryUpdate } from "../validation/CategoryValidation";
import { errorKey } from "../mapping/errors";

export class CategoriesController {
    static async getAllByUserId(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        const {error} = idValidation.validate(userId)
        if (error){
            return next({error: error.details[0].message})
        } 

        const categories = await Categories.findByUserId(parseInt(userId));

        if('error' in categories) return next(categories)

        const categoriesArray = Array.isArray(categories) ? categories : [categories];
        return res.json(categoriesArray)
    }
    static async create(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        const {error} = categoryCreation.validate(data);
        if(error){
            return next({error: error.details[0].message})
        }

        try {
            const newCategory = await Categories.create(data);
            if(!newCategory) return next(PatternResponses.createError('notCreated', ['category']));
            return res.json(newCategory)
        } catch (error) {
            if('message' in (error as any) && (error as any).message == 'alreadyExists') 
                return next(PatternResponses.createError((error as any).message as errorKey, ['Category', 'description']))
            return next(error);
        }
    }
    static async update(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;
        const data = req.body;

        console.log(id, data)
        const {error} = categoryUpdate.validate(data);
        if(error){
            return next({error: error.details[0].message})
        }

        try {
            await Categories.update(data, {where: {id}});
            return res.json(PatternResponses.createSuccess('updated', ['category']));
        } catch (error) {
            if('message' in (error as any) && (error as any).message == 'alreadyExists') 
                return next(PatternResponses.createError((error as any).message as errorKey, ['Category', 'description']))
            return next(error);
        }
    }
}