import dotenv from 'dotenv';
import Stripe, {} from 'stripe';
import {v4 as uuid4} from 'uuid'

export const stripeKey = process.env.STRIPEKEY
export const stripePublic = process.env.STRIPEPUBLICKEY

export const stripe = new Stripe(stripeKey as string, {
    maxNetworkRetries: 1,
    timeout: 1000,
    port: 3000,
    apiVersion: "2023-10-16"
})

export const createIdempotencyKey = uuid4()
export const createMetadataObject = (description: string, refundDetails: string, customerId: number)=>{
    return {
        description, refundDetails, customerId
    }
}


export const balance = async ()=>{
    return await stripe.balance.retrieve();
}