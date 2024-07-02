import Joi from "joi";

export const categoryCreation = Joi.object({
    userId: Joi.number().required(),
    description: Joi.string().required()
})

export const categoryUpdate = Joi.object({
    description: Joi.string().required()
})