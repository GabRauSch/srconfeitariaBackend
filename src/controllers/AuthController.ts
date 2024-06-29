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
import PlanPayments from '../models/PlanPayments';
import { addMonths, constructNow } from 'date-fns';
import Plans from '../models/Plans';
import Products from '../models/Products';
import PlanDiscounts from '../models/PlanDiscounts';

type PlanData = {
    userId: number
    planId: number
    dueDate: Date,
    value: number
    discountId?: number
}

class AuthController {    
    static async register(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        const {error} = registerValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 

        const transaction = await sequelize.transaction()
        const nameTaken = await Users.findByName(data.name, transaction);
        if(!('error' in nameTaken)){
            transaction.rollback()
            return next(PatternResponses.createError('dataTaken', ['name'], 'Nome já pertence a um usuário'))
        }

        const userExists = await Users.userByEmail(data.email, transaction)
        const passwordHash = generateHash(data.password)
        const confirmationCode = generateConfirmationCode(5);

        let userId;


        if(!('error' in userExists) && userExists.email == data.email){
            const [rowsAffected] = await Users.update({...data, confirmationCode, passwordHash}, {
                where: { email: data.email },
                transaction
            });

            if(rowsAffected == 0) {
                transaction.rollback()
                return next(PatternResponses.createError('notUpdated', ['temporary user']))
            }

            const user = await Users.findOne({where: {email: data.email}, attributes: ['id']})
            if(!user) return next(PatternResponses.createError('noRegister', ['temporaryUser']))
            userId = user.id
            return res.json(user)
        } 

        if('error' in userExists){
            const userCreation = await Users.createTemporaryUser({...data, confirmationCode, passwordHash, planId: 1}, transaction)
            if('error' in userCreation){
                transaction.rollback()
                return next(userCreation)
            }
        }

        transaction.commit()
        
        sendEmail({
            senderName: "Email de confirmação",
            title: `Confirme a tentativa de registro de ${data.name}`,
            content: confirmationCode,
            receiver: data.email
        })

        const token = generateToken({id: userId})
        return res.json({
            message: "Temporary User created",
            confirmationCode,
            token
        })
    }
    static async redefinePassowrd(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const {userId} = req.params

        const validateId = idValidation.validate(userId);
        if(validateId.error) return next({error: validateId.error.details[0].message});
        const {error} = redefinePassowrdValidation.validate(data);
        if(error) return next({error: error.details[0].message});

        const confirmationCode = generateConfirmationCode(5)
        const [rowsAffected] = await Users.update({confirmationCode}, {where: {id: userId, email: data.email}});
        if(rowsAffected == 0) return next(PatternResponses.createError('notUpdated', ['user']))

        sendEmail({
            senderName: "Email de confirmação",
            title: `Confirme a tentativa de registro de redefinição de senha`,
            content: confirmationCode,
            receiver: data.email
        })
        return res.json(PatternResponses.createSuccess('emailSent'))            
    }

    static async confirmRedefinePassword(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const {userId} = req.params

        const {error} = confirmRedefinePasswordValidation.validate(data);
        if(error) return next({error: error.details[0].message});

        const transaction = await sequelize.transaction()
        const user = await Users.userByConfirmationCodeAndEmail(data.confirmationCode, data.email, transaction)
        if('error' in user) return next(user)

        const passwordHash = generateHash(data.password);   
        const updatedUser = await Users.update({passwordHash, confirmationCode: null}, {where: {id: userId}});
        if('error' in updatedUser){
            transaction.rollback()
            return next(updatedUser)
        }
        transaction.commit()

        return res.json(PatternResponses.createSuccess('updated'))

    }

    static async registerConfirmation(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        const {error} = confirmRegisterValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 

        const transaction = await sequelize.transaction()
        const user = await Users.userByConfirmationCodeAndEmail(data.confirmationCode,data.email, transaction);
        if('error' in user) return next(user)
    
        const updatedUser = await Users.confirmCreation(user, transaction);
        if('error' in updatedUser){
            transaction.rollback()
            return next(updatedUser)
        }

        const plan = await Plans.findByPk(user.planId);
        if(!plan) return next(PatternResponses.createError('noRegister', ['plan']))

            
        const planData: PlanData = {
            userId: user.id,
            planId: user.planId,
            dueDate: addMonths(new Date(), 1),
            value: plan.planValue,
        }

        if(data.code){
            const discount = await PlanDiscounts.findOne({where: {code: data.code}})
            if(discount) {
                planData.discountId = discount.id;
                planData.value = planData.value - planData.value * discount.amount
                discount.usedCount += 1;
                discount.save()
            }
        }

        const planPayments = await PlanPayments.create(planData, {transaction})
        if(!planPayments) {
            transaction.rollback()
            return next(PatternResponses.createError('notCreated', ['plan payment']))
        }

        transaction.commit();

        return res.json(updatedUser)
    }
    
    static async login(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        
        const {error} = loginValidation.validate(data)
        if (error){
            return next({error: error.details[0].message})
        } 
    
        const passwordHash = generateHash(data.password)
    
        const user = await Users.getUserByEmailAndPasswordHash(data.email, passwordHash);
        if('error' in user) return next(user)
        
        if(!user.active){
            return next(PatternResponses.createError('temporaryUser', ['be logged in']))
        }
        const token = generateToken({id: user.id});
        return res.json({
            token
        })
    }

    static async toggleUserActivation(req:Request, res: Response, next: NextFunction){
        const {userId} = req.params;

        const {error} = idValidation.validate(userId);
        if (error) return next({error: error.details[0].message}) 

        const toggled = await Users.toggleActivation(parseInt(userId))
        if('error' in toggled) return next(toggled);
        
        const user = await Users.findByPk(userId, {attributes: ['active']})
        return res.json(user)
    } 
}

export default AuthController