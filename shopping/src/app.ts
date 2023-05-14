import express, {Express} from 'express';
import cors from 'cors';
import { ShoppingApi } from './api';
import { CreateChannel } from './utils';

export const ShoppingApp = async (app:Express) => {

    app.use(express.json());
    app.use(cors());

    const channel = await CreateChannel()

    ShoppingApi(app, channel);
    // error handling
    
}
