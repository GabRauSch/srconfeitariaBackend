import Joi from "joi"

export const productCreation = Joi.object({
    userId: Joi.number().required(),
    categoryId: Joi.number(),
    name: Joi.string().min(3).max(35).required(),
    description: Joi.string().min(3).max(60).required(),
    size: Joi.string(),
    format: Joi.string(),
    weight: Joi.string(),
    value: Joi.number().required(),
    productionCost: Joi.number(),
    photo: Joi.string(),
    categoryData: Joi.object({
        description: Joi.string().min(3).max(15).required()
    }),
}).or('categoryId', 'categoryData').required();

export const productUpdateValidation = Joi.object({
    name: Joi.string().min(3).max(35),
    description: Joi.string().min(3).max(60),
    size: Joi.string(),
    format: Joi.string(),
    weight: Joi.string(),
    value: Joi.number(),
    productionCost: Joi.number(),
    photo: Joi.string(),
    categoryId: Joi.number(),
    categoryData: Joi.object({
        description: Joi.string().min(3).max(15).required()
    }),
}).or('categoryId', 'categoryData').required();