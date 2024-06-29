import Joi from "joi"

export const orderItemUpdateValidation = Joi.object({
    orderItems: Joi.array().items(
        Joi.object({
            productId: Joi.number().required(),
            quantity: Joi.number().required(),
            finished: Joi.boolean().required(),
            value: Joi.number().min(0).required()
        })
    ),
    order: Joi.object({
        orderStatus: Joi.number().min(0).max(2)
    })
})