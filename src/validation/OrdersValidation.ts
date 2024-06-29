import Joi from "joi"

export const orderCreation = Joi.object({
    userId: Joi.number().required(),
    clientId: Joi.number().required(),
    deliveryDate: Joi.date().required(),
    value: Joi.number(),
    deliveryCost: Joi.number(),
    orderStatus: Joi.number().min(0).max(2),
    products: Joi.array().items(Joi.object({
        id: Joi.number().required(),
        quantity: Joi.number().required(),
        value: Joi.number().required()
    })).required()
})
export const orderUpdateValidation = Joi.object({
    deliveryDate: Joi.date(),
    value: Joi.number(),
    deliveryCost: Joi.number(),
    orderStatus: Joi.number().min(0).max(2),
})