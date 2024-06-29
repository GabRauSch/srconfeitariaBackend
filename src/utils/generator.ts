import { UserAttributes } from "../models/Users";

export const generateConfirmationCode = (length: number)=>{
    return Math.floor(Math.random() * 8 * (10 **length -1) + 1000).toString();
}

export const generateRefferalCode = (user: UserAttributes)=>{
    const id = user.id.toString().slice(0,2);
    const firstLetters = user.name.slice(0, 2).toLowerCase();
    const random = generateConfirmationCode(2)

    return id + firstLetters + random
}