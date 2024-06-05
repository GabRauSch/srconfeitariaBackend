import Joi from "joi"

export const orderItemUpdateValidation = Joi.object({
    productId: Joi.number().required(),
    quantity: Joi.number().required()
})