import Joi from "joi"

export const productCreation = Joi.object({
    userId: Joi.number().required(),
    categoryId: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    size: Joi.string(),
    format: Joi.string(),
    weight: Joi.string(),
    value: Joi.number().required(),
    productionCost: Joi.number(),
    photo: Joi.string(),
})
export const productUpdateValidation = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    size: Joi.string(),
    format: Joi.string(),
    weight: Joi.string(),
    value: Joi.number(),
    productionCost: Joi.number(),
    photo: Joi.string(),
})