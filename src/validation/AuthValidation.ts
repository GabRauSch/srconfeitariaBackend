import Joi from "joi";

export const registerValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string(),
    planId: Joi.number().required(),
    userPermission: Joi.number(),
    acceptedTerms: Joi.boolean()
})

export const confirmRegisterValidation = Joi.object({
    email: Joi.string().required(),
    confirmationCode: Joi.string().required(),
    code: Joi.string()
})

export const loginValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

export const redefinePassowrdValidation = Joi.object({
    email: Joi.string().required(),
})
export const confirmRedefinePasswordValidation = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    confirmationCode: Joi.string().required()
})