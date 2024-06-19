import {NextFunction, Request, Response } from 'express';
import PatternResponses from '../utils/PatternResponses'
import { generateToken, generateHash } from '../config/passport';
import { sendEmail } from '../config/email';
import { confirmRedefinePasswordValidation, confirmRegisterValidation, loginValidation, redefinePassowrdValidation, registerValidation } from '../validation/AuthValidation';
import Users from '../models/Users';
import sequelize from '../config/mysql';
import { idValidation } from '../validation/GlobalValidation';
import { Sequelize } from 'sequelize';
import { generateConfirmationCode } from '../utils/generator';
class AnalyticsController {    
    static async getResults(req: Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        const {error} = idValidation.validate(userId)
        if (error){
            return next({error: error.details[0].message})
        } 

       const data = await Users.getResults(parseInt(userId))
        if('error' in data){
            return next(data)
        }
        return res.json(data)
    }
}

export default AnalyticsController