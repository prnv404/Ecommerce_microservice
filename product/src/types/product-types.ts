import { Request } from "express"

export interface ProductInterface {
    name: string
    desc: string
    type: string
    unit: number
    price: number
    available: boolean
    suplier: string,
    banner: string
}
export interface Payload {
    _id: string
    email:string
}

export interface ValidateRequest extends Request {
    user:Payload
}

export type ProductPayload = {productId:string,qty:number}