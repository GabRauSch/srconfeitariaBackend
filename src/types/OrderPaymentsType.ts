export interface OrderPaymentsAttributes {
    id: number,
    orderId: number,
    value: number,
    dueDate: Date,
    paymentDay: Date
}