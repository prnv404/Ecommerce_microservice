import express, { Express } from 'express';

import cors from 'cors';
import { CustomerApi } from './api';
import { CreateChannel } from './utils';

export const ExpressApp = async (app:Express) => {

    app.use(express.json());
    app.use(cors());
  
    const channel = await CreateChannel()

    CustomerApi(app, channel);
    
    // error handling
    
}
