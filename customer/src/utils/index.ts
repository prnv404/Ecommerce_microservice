import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as amqplib from "amqplib";

import { APP_SECRET, EXCHANGE_NAME, CUSTOMER_SERVICE, MSG_QUEUE_URL } from '../config/index'
import { Payload, ValidateRequest } from "../types";
import { CustomerService } from "../service/customer-service";
import { Request } from "express";

//Utility functions
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password:string, salt:string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async ( enteredPassword:string, savedPassword:string, salt:string) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload:Payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ValidateSignature = async (req:ValidateRequest) => {
  try {
    const signature = req.get("Authorization") as string;
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET) as Payload
    req.user = payload 
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const FormateData = (data:any) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

//Message Broker
export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

export const PublishMessage = (channel:amqplib.Channel, service:any, msg:any) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};

export const SubscribeMessage = async (channel:amqplib.Channel, service:any) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);

  channel.consume(
    q.queue,
    (msg:any) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};
