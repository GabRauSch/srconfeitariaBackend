import Joi from "joi";

export const orderPaymentCreation = Joi.object({
    orderId: Joi.number().required(),
    value: Joi.number().required(),
    dueDate: Joi.date().required(),
    paidValue: Joi.date(),
    paymentDate: Joi.date()
})