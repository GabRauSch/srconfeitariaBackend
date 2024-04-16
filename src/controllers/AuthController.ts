import {Request, Response } from 'express';
import PatternResponses from '../utils/PatternResponses'
import { generateToken, generateHash } from '../config/passport';
import { sendEmail } from '../config/email';
import UsersModel from '../models/Users';

class AuthController {
    static async checkEmailAvailability(req: Request, res: Response){
        const {email} = req.body;
        
        const userExists = await UsersModel.userByEmail(email);
        if(userExists && userExists.name !== null){
            return PatternResponses.error.alreadyExists(res, 'user')
        }
        
        return res.json({message: 'Email available'})
    }
    
    static async register(req: Request, res: Response){
        const {email, password, customName} = req.body;
    
        const nameIsTaken = await UsersModel.userByName(customName);
        if(nameIsTaken) return PatternResponses.error.alreadyExists(res, 'user with this name') 
    
        const userExists = await UsersModel.userByEmail(email);
        if(userExists && !userExists.name){
            console.log('user exists')
            return PatternResponses.error.alreadyExists(res, 'user')
        }
        
        const passwordHash = generateHash(password)
        const confirmationCode = generateHash(`${customName}:${new Date().getMilliseconds()}`);
        if(userExists && !userExists.name){
            const updateUser = await UsersModel.update(
                {confirmationCode},
                {
                    where: {
                        email
                    }
                }
            )
            sendEmail({
                senderName: "Confirmation email",
                title: `Confirm signup attempt to user ${customName}`,
                content: confirmationCode,
                receiver: email
            })
            return res.json({
                message: "Temporary user already exists, Token has been resent",
                token: confirmationCode
            })
        }
    
        const userCreationId = await UsersModel.createTemporaryUser(email, passwordHash, confirmationCode)
        if(!userCreationId){
            return PatternResponses.error.notCreated(res, 'user')
        }
        
        sendEmail({
            senderName: "Confirmation email",
            title: `Confirm signup attempt to user ${customName}`,
            content: confirmationCode,
            receiver: email
        })
        const token = generateToken({id: userCreationId})
        return res.json({
            message: "Temporary User created",
            confirmationCode,
            token
        })
    }
    
    static async registerConfirmation(req: Request, res: Response){
        const {userToken, customName} = req.body;
    
        if(!userToken || !customName){
            return PatternResponses.error.missingAttributes(res, 'userToken, custom name')
        }
        const nameIsTaken = await UsersModel.userByName(customName);
        if(nameIsTaken){
            console.log('name is taken')
            return PatternResponses.error.alreadyExists(res, 'user with name')
        }
    
        const user = await UsersModel.userByConfirmationCode(userToken)
        console.log(user)
        if(!user){
            return PatternResponses.error.noRegister(res)
        }
    
        const updatedUser = await UsersModel.confirmCreation(user, customName);
        if(!updatedUser){
            return PatternResponses.error.notUpdated(res)
        }
        
        return res.json(updatedUser)
    }
    
    static async login(req: Request, res: Response){
        const {email, password} = req.body;
        if(!email || !password){
            return PatternResponses.error.missingAttributes(res, 'email, password')
        }
    
        const passwordHash = generateHash(password)
    
        const user = await UsersModel.getUserByEmailAndPasswordHash(email, passwordHash);
        
        if(!user){
            return PatternResponses.error.noRegister(res)
        }
        if(user?.name == null){
            return res.json({error: "Temporary user cannot be logged in"})
        }
        const token = generateToken({id: user.id});
        return res.json({
            token
        })
    }
}

export default AuthController