import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import amqplib from "amqplib";

import { APP_SECRET, EXCHANGE_NAME, MSG_QUEUE_URL } from "../config";
import { Payload, ValidateRequest } from "../types";

//Utility functions
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password:string, salt:string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (enteredPassword:string,savedPassword:string,salt:string) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload:any) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ValidateSignature = async (req:ValidateRequest) => {
  try {
    const signature = req.get("Authorization") as string
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload as Payload
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

//Raise Events
// export const PublishCustomerEvent = async (payload) => {
//   axios.post("http://customer:8001/app-events/", {
//     payload,
//   });

//   //     axios.post(`${BASE_URL}/customer/app-events/`,{
//   //         payload
//   //     });
// };

// export const PublishShoppingEvent = async (payload) => {
//   // axios.post('http://gateway:8000/shopping/app-events/',{
//   //         payload
//   // });

//   axios.post(`http://shopping:8003/app-events/`, {
//     payload,
//   });
// };

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
