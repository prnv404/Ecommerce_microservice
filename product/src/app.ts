import express, { Express }  from "express";
import cors from "cors";
import { ProductApi } from "./api";
import { CreateChannel } from "./utils";

export const ExpressApp = async (app: Express) => {
    
  app.use(express.json());
  app.use(cors());
  //api
  // appEvents(app);
    const channel = await CreateChannel();
    
    ProductApi(app, channel);

  // error handling
};
