import Joi from "joi";

export const orderPaymentCreation = Joi.object({
    orderId: Joi.number().required(),
    selectedPayment: Joi.number().min(0).max(2).required(),
    payments: Joi.array().items({
        value: Joi.number().required(),
        dueDate: Joi.date().required(),
        installments: Joi.number()
    })
})