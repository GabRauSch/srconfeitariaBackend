export const generateConfirmationCode = (length: number)=>{
    return Math.floor(Math.random() * 9 * (10 **length -1)).toString();
}