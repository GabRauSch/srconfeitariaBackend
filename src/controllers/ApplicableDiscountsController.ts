import { NextFunction, Request, Response } from "express";
import { idValidation } from "../validation/GlobalValidation";
import { productCreation, productUpdateValidation } from "../validation/ProductsValidation";
import PatternResponses from "../utils/PatternResponses";
import Products from "../models/Products";
import Categories from "../models/Categories";
import { errorKey } from "../mapping/errors";
import Users from "../models/Users";

export class ApplicableDiscountController {
    static async getByUserId(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        const {error} = idValidation.validate(userId)
        if (error){
            return next({error: error.details[0].message})
        } 

        const refferalCode = await Users.findRefferalCode(parseInt(userId));

        if('error' in refferalCode) return next(refferalCode)
        return res.json(refferalCode)
    }

    static async create(req: Request, res: Response, next: NextFunction){
        const user = req.user

        console.log(user)

        return res.json(user)
    }
}