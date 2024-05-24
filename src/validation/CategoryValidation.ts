import Joi from "joi";

export const categoryCreation = Joi.object({
    userId: Joi.number().required(),
    description: Joi.string().required()
})