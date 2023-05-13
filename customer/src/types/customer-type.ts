import { Request } from "express"


export interface CustomerInterfafce {
    email: string,
    password: string,
    salt: string,
    phone: string,
}


export interface CreateAddress {
    _id: string,
    street: string,
    postalCode: string,
    city: string
    country: string
}

export interface Wishlist{
    _id: string
    name: string
    desc: string
    price: number
    available: string
    banner:string
}

export interface AddCartItemm {
    _id: string
    name: string
    price: string
    banner: string
    
}

export interface SignInInput {
    email: string
    password: string
    phone:string
}

export interface Payload {
    _id: string
    email:string
}

export interface ValidateRequest extends Request {
    user:Payload
}