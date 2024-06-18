import Joi from "joi";

export const updateUserValidation = Joi.object({
    name: Joi.string().min(3).max(25),
    phone: Joi.string().pattern(/^(\+?\d{1,4}?[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d-\s]{7,}$/).messages({
        'string.pattern.base': 'Invalid phone number format'
    })
})