import Joi from "joi"

export const orderCreation = Joi.object({
    userId: Joi.number().required(),
    clientId: Joi.number().required(),
    deliveryDate: Joi.date().required(),
    value: Joi.number(),
    deliveryCost: Joi.number(),
    orderStatus: Joi.number().min(0).max(2),
    products: Joi.array().items(Joi.object({
        id: Joi.number(),
        quantity: Joi.number()
    })).required()
})
export const orderUpdateValidation = Joi.object({
    orderNumber: Joi.number(),
    deliveryDate: Joi.date(),
    value: Joi.number(),
    deliveryCost: Joi.number(),
    delivered: Joi.date(),
    orderStatus: Joi.number().min(0).max(2),
})