import Joi from "joi";

export const clientCreationValidation = Joi.object({
    userId: Joi.number().min(1).max(10).required(),
    name: Joi.string().min(1).max(20).required(),
    phone: Joi.string().min(11).max(14),
    email: Joi.string().email(),
    birthday: Joi.date(),
    postalCode: Joi.number().min(8).max(8),
    local: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number()
    })
})

export const clientUpdateValidation = Joi.object({
    name: Joi.string().min(1).max(20),
    phone: Joi.string().min(11).max(14),
    email: Joi.string().email(),
    birthday: Joi.date(),
    postalCode: Joi.number().min(8).max(8),
    local: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number()
    })
})