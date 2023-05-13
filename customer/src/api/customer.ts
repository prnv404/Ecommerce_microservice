import { CustomerService } from '../service/customer-service';
// import UserAuth from './middlewares/auth';
import { SubscribeMessage } from '../utils';
import express, { Express, NextFunction, Request, Response } from 'express'
import * as amqplib from 'amqplib'
import { ValidateRequest } from '../types';
import { UserAuth } from './middleware/auth-middleware';



export const CustomerApi = (app:Express, channel:amqplib.Channel) => {
    
    const service = new CustomerService();

    // To listen
    SubscribeMessage(channel, service);


    app.post('/signup', async (req:Request,res:Response,next:NextFunction) => {
        const { email, password, phone } = req.body;
        const { data } = await service.SignUp({ email, password, phone}); 
        res.json(data);

    });

    app.post('/login',  async (req:Request,res:Response,next:NextFunction) => {
        
        const { email, password ,phone} = req.body;

        const { data } = await service.SignIn({ email, password,phone});

        res.json(data);

    });

    app.post('/address', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        
        const request = req as ValidateRequest
        
        const { _id } = request.user

        const { street, postalCode, city,country } = req.body;

        const { data } = await service.AddNewAddress(_id, { street, postalCode, city, country,_id });
        
        res.json(data);

    });
     

    app.get('/profile', UserAuth ,async (req:Request,res:Response,next:NextFunction) => {

        const request = req as ValidateRequest
        
        const { _id } = request.user

        const { data } = await service.GetProfile(_id );

        res.json(data);

    });
     

    app.get('/shoping-details', UserAuth, async (req:Request,res:Response,next:NextFunction) => {
        
        const request = req as ValidateRequest
        
        const { _id } = request.user
        const { data } = await service.GetShopingDetails(_id);
        return res.json(data);
        
    });
    
    app.get('/wishlist', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        
        const request = req as ValidateRequest
        const { _id } = request.user
        const { data } = await service.GetWishList( _id);
        return res.status(200).json(data);
        
    });


}
