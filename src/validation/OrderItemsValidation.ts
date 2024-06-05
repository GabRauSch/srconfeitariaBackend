import Joi from "joi"

export const orderItemUpdateValidation = Joi.array().items(
    Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
        finished: Joi.boolean().required()
    })
);