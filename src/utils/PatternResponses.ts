
import { Response } from "express"
import { object } from "joi";
import { CustomError } from "../types/ErrorType";
import { errorKey } from "../mapping/errors";
import { errorsTypes } from "../mapping/errors";
import { successKey, successTypes } from "../mapping/success";
import { customSuccess } from "../types/SuccessType";

class PatternResponses{
    static createError(errorKey: errorKey, object?: any[]): CustomError{
        let message = errorsTypes[errorKey].message.toString();
        if(object){
            object.forEach((replacement: string | number, key: number)=>{
                message = message.replace(`$${key+1}`, replacement.toString())
            })
        }

        const customError = {
            error: message,
            code: errorsTypes[errorKey].code,
            errorType: errorsTypes[errorKey].errorType,
            status: errorsTypes[errorKey].status
        }
        return customError
    }
    static createSuccess(successKey: successKey, object?: any[]): customSuccess{
        let message = successTypes[successKey].message.toString();
        if(object){
            object.forEach((replacement: string | number, key: number)=>{
                message = message.replace(`$${key+1}`, replacement.toString())
            })
        }

        const customSuccess = {
            success: message,
            code: successTypes[successKey].code,
            successType: successTypes[successKey].successType,
            status: successTypes[successKey].status
        }
        return customSuccess
    }
}

export default PatternResponses