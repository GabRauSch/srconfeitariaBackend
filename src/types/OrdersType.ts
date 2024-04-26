import { OrderStatus } from "../mapping/orderStatus";

export interface OrderAttributes {
    id: number,
    clientId: number,
    orderNumber: number,
    deliveryDate: Date,
    value: number,
    deliveryCost: number,
    delivered: Date,
    orderStatus: OrderStatus 
}