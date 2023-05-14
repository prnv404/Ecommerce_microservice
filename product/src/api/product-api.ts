import { CUSTOMER_SERVICE, SHOPPING_SERVICE } from "../config";
import { ProductService } from "../service/product-service";
import {  PublishMessage } from "../utils";
import { UserAuth } from "./middleware/auth-middleware";
import { Express,Request,Response,NextFunction } from "express";
import * as amqplib from 'amqplib'
import { Payload, ProductInterface, ValidateRequest } from "../types";


export const ProductApi = (app: Express, channel: amqplib.Channel) => {
  
  const service = new ProductService();

  app.post("/product/create", async (req, res, next) => {

    const { name, desc, type, unit, price, available, suplier, banner }:ProductInterface = req.body;
    
    // validation
    const { data } = await service.CreateProduct({
      name,
      desc,
      type,
      unit,
      price,
      available,
      suplier,
      banner,
    });

    return res.json(data);

  });

  app.get("/category/:type", async (req:Request, res:Response, next:NextFunction) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.get("/:id", async (req:Request, res:Response, next:NextFunction) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.post("/ids", async (req:Request, res:Response, next:NextFunction) => {
    const { ids } = req.body;
    const products = await service.GetSelectedProducts(ids);
    return res.status(200).json(products);
  });

  app.put("/wishlist", UserAuth, async (req: Request, res: Response, next: NextFunction) => {
    const request = req as ValidateRequest
    const { _id } = request.user 

    const { data } = await service.GetProductPayload(
      _id,
      { productId: request.body._id },
      "ADD_TO_WISHLIST"
    );

    // PublishCustomerEvent(data);
    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

    res.status(200).json(data.data.product);
  });

  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {

    const request = req as ValidateRequest

    const { _id } = request.user 

    const productId = request.params.id;

    const { data } = await service.GetProductPayload(
      _id,
      { productId },
      "REMOVE_FROM_WISHLIST"
    );

    // PublishCustomerEvent(data);
    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

    res.status(200).json(data.data.product);
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const request = req as ValidateRequest
    const { _id } = request.user 

    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id, qty: req.body.qty },
      "ADD_TO_CART"
    );

    // PublishCustomerEvent(data);
    // PublishShoppingEvent(data);

    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
    PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

    const response = { product: data.data.product, unit: data.data.qty };

    res.status(200).json(response);
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const request = req as ValidateRequest
    const { _id } = request.user 
    const productId = request.params.id;

    const { data } = await service.GetProductPayload(
      _id,
      { productId },
      "REMOVE_FROM_CART"
    );

    // PublishCustomerEvent(data);
    // PublishShoppingEvent(data);

    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
    PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

    const response = { product: data.data.product, unit: data.data.qty };

    res.status(200).json(response);
  });

  app.get("/whoami", (req, res, next) => {
    return res
      .status(200)
      .json({ msg: "/ or /products : I am products Service" });
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });
};
