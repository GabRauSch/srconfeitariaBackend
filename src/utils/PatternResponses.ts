
import { Response } from "express"


class Success {
    static created = (res: Response, message?: string, registry?: any) =>{
        message = message ? message : "Created with Success";
        const status = 201
        return registry ?
            PatternResponses.createSuccessfullMessageWithRegistry(res, status, message, registry) :
            PatternResponses.createSuccessfullMessageWithNoRegistry(res, status, message)
    }
    static changed = (res: Response, message?: string, registry?: any)=>{
        message = message ? message : "Changed with Success";
        const status = 200
        return registry ?
            PatternResponses.createSuccessfullMessageWithRegistry(res, status, message, registry) :
            PatternResponses.createSuccessfullMessageWithNoRegistry(res, status, message)
    }    
    static deleted = (res: Response, message?: string, registry?: any)=>{
        message = message ? message : "Deleted with Success";
        const status = 200
        return registry ?
            PatternResponses.createSuccessfullMessageWithRegistry(res, status, message, registry) :
            PatternResponses.createSuccessfullMessageWithNoRegistry(res, status, message)
    }
    
    static updated = (res: Response, message?: string, registry?: any)=>{
        message = message ? message : "Updated with Success";
        const status = 200
        return registry ?
            PatternResponses.createSuccessfullMessageWithRegistry(res, status, message, registry) :
            PatternResponses.createSuccessfullMessageWithNoRegistry(res, status, message)
    }
    static sent = (res: Response, message?: string, registry?: any)=>{
        message = message ? message : "Sent with success";
        const status = 200;
        return registry ?
            PatternResponses.createSuccessfullMessageWithRegistry(res, status, message, registry) :
            PatternResponses.createSuccessfullMessageWithNoRegistry(res, status, message)
    }
    static imageUploaded = (res: Response, registry?: object, message?: string)=>{
        message = message ? message : "Image uploaded with success";
        const status = 200;
        return registry ?
            PatternResponses.createSuccessfullMessageWithRegistry(res, status, message, registry) :
            PatternResponses.createSuccessfullMessageWithNoRegistry(res, status, message)
    }
}

class Error {
    static internalServerError = (res: Response, message?: string)=>{
        message = message ? message : "Internal server error";
        const status = 404
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static invalidDate = (res: Response)=>{
        const message =  `not a valid date`;
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static notFound = (res: Response, object: string)=>{
        const message =  `${object} not found`;
        const status = 404
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static doesntBelong = (res: Response, object: string, state: string)=>{
        const message = `${object} doesn't belong to ${state}`;
        const status = 400;
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static noRegister = (res: Response, message?: string, registry?: any)=>{
        console.error('no register')
        message = message ? message : "No register for the object";
        const status = 404
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static missingAttributes = (res: Response, attributes: string | string[], message?: string)=>{
        let attributesString: string | string[] = "";
        if(Array.isArray(attributes) && !message){
            attributesString = attributes.join(", ")
        } else{
            attributesString = attributes
        }
        message = `Missing attributes: [${attributesString}]`
        const status = 400;
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static invalidAttributes = (res: Response, attributes: string | string[], message?: string)=>{
        let attributesString: string | string[] = "";
        if(Array.isArray(attributes) && !message){
            attributesString = attributes.join(", ")
        } else{
            attributesString = attributes
        }
        message = `Invalid attributes: [${attributesString}]`
        const status = 400;
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static notCreated = (res: Response, type: string, message?: string)=>{
        message = message ? message : `${type} could not be created`;
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static alreadyExists = (res: Response, object: string)=>{
        const message = `${object} already exists`
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static notChanged = (res: Response, message?: string)=>{
        message = message ? message : "Not changed";
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static notDeleted = (res: Response, message?: string)=>{
        message = message ? message : "Not deleted";
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static notUpdated = (res: Response, message?: string)=>{
        message = message ? message : "Not updated";
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    
    static notAuthorized = (res: Response, message?: string)=>{
        message = message ? message : "Not authorized";
        const status = 401
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static imageNotUploaded = (res: Response, message?: string)=>{
        message = message ? message : "Image not uploaded";
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static wrongCredential = (res: Response, message?: string)=>{
        message = message ? message : "Email and/or password don't match";
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    
    static emailNotSent = (res: Response, email: string, message?: string)=>{
        message = message ? message : `couldn't send email to ${email}`;
        const status = 400
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
    static notSent = (res: Response, message?: string)=>{
        message = message ? message : "Couldn't send message";
        const status = 200;
        return PatternResponses.createUnsuccessfullMessage(res, status, message)
    }
}

class PatternResponses{
    static error = class extends Error {}
    static success = class extends Success{}   
    static createSuccessfullMessageWithRegistry(res: Response, status: number, message: string, registry: any){
        res.status(status);
        return res.json({message, registry});
    }
    static createSuccessfullMessageWithNoRegistry(res: Response, status: number, message: string){
        res.status(status);
        return res.json({message})
    }
    static createUnsuccessfullMessage(res: Response, status: number, message: string){
        res.status(status);
        return res.json({message})
    }
}

export default PatternResponses