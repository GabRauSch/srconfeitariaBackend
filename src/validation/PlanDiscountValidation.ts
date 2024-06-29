import Joi from "joi"

export const useDiscountValidation = Joi.object({
    userId: Joi.number().required(),
    discountId: Joi.number().required()
})