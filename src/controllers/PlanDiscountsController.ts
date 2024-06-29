import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import { productCreation, productUpdateValidation } from "../validation/ProductsValidation";
import PatternResponses from "../utils/PatternResponses";
import Products from "../models/Products";
import Categories from "../models/Categories";
import { errorKey } from "../mapping/errors";
import { useDiscountValidation } from "../validation/PlanDiscountValidation";
import PlanDiscounts from "../models/PlanDiscounts";

export class PlanDiscountsController {
    static async useDiscount(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        const {error} = useDiscountValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 

        try {
            const [rowsAffected] = await PlanDiscounts.update({dateUsed: new Date()}, {where: {userId: data.userId, applicableDiscountId: data.discountId}})
            
            if(!rowsAffected) return res.json(PatternResponses.createError('notUpdated', ['planDiscount']))

            return res.json(PatternResponses.createSuccess('updated', ['planDiscount']))
        } catch (error) {
            console.error(error);
            return next(PatternResponses.createError('notCreated', ['planDiscount']))
        }
        
    }
}