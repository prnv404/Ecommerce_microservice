import {ShoppingService} from "../service/shopping-service"
import {  SubscribeMessage } from "../utils";
import {UserAuth} from './middleware/auth-middleware';
import { CUSTOMER_SERVICE } from '../config';
import { PublishMessage } from '../utils';
import { Express, NextFunction, Request, Response } from 'express'
import * as amqplib from 'amqplib'
import { ValidateRequest } from "../types";


export const ShoppingApi = (app: Express, channel: amqplib.Channel) => {
    
    const service = new ShoppingService();

    SubscribeMessage(channel, service)

    app.post('/order',UserAuth, async (req:Request,res:Response,next:NextFunction) => {

        const request = req as ValidateRequest
        const { _id } = request.user 

        const { txnNumber } = req.body;

        const { data } = await service.PlaceOrder({_id, txnNumber});
        
        const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER')
        // PublishCustomerEvent(payload)

        PublishMessage(channel,CUSTOMER_SERVICE, JSON.stringify(payload))

        res.status(200).json(data);

    });

    app.get('/orders',UserAuth, async (req:Request,res:Response,next:NextFunction) => {

       const request = req as ValidateRequest
        const { _id } = request.user 

        const { data } = await service.GetOrders(_id);
        
        res.status(200).json(data);

    });

    app.put('/cart',UserAuth, async (req:Request,res:Response,next:NextFunction) => {

        const request = req as ValidateRequest
        const { _id } = request.user 
        const {item,qty,isRemove}  = request.body

        const { data } = await service.ManageCart(_id,item,qty,isRemove);
        
        res.status(200).json(data);

    });

    app.delete('/cart/:id',UserAuth, async (req:Request,res:Response,next:NextFunction) => {

        const request = req as ValidateRequest
        const { _id } = request.user
        const {item,qty,isRemove}  = request.body

        const { data } = await service.ManageCart(_id, item,qty,isRemove);
        
        res.status(200).json(data);

    });
    
    app.get('/cart', UserAuth, async (req:Request,res:Response,next:NextFunction) => {

        const request = req as ValidateRequest
        const { _id } = request.user
        
        const { data } = await service.GetCart( _id );

        return res.status(200).json(data);
    });

    app.get('/whoami', (req,res,next) => {
        return res.status(200).json({msg: '/shoping : I am Shopping Service'})
    })
 
}
