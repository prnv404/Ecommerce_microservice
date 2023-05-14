import {Request} from 'express'

export interface Payload {
    _id: string
    email:string
}

export interface ValidateRequest extends Request {
    user:Payload
}