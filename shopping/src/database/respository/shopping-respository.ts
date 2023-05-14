import { ProductInterface } from "../model/shopping-model";

import mongoose from 'mongoose';
import { OrderModel, CartModel } from '../model'
import { v4 as uuidv4 } from 'uuid';

//Dealing with data base operations
export class ShoppingRepository {

    async Orders(customerId:string){

        const orders = await OrderModel.find({customerId });
        
        return orders;

    }

    async Cart(customerId:string){

        const cartItems = await CartModel.find({ customerId: customerId });


        if(cartItems){
            return cartItems;
        }

        throw new Error('Data Not found!');
    }

    async AddCartItem(customerId:string,item:any,qty:number,isRemove:boolean){
 
            // return await CartModel.deleteMany();
 
            const cart = await CartModel.findOne({ customerId: customerId })

            const { _id } = item;

            if(cart){
                
                let isExist = false;

                let cartItems = cart.items;


                if(cartItems.length > 0){

                    cartItems.map(item => {
                                                
                        if(item.product._id.toString() === _id.toString()){
                            if(isRemove){
                                cartItems.splice(cartItems.indexOf(item), 1);
                             }else{
                               item.unit = qty;
                            }
                             isExist = true;
                        }
                    });
                } 
                
                if(!isExist && !isRemove){
                    cartItems.push({product: { ...item}, unit: qty });
                }

                cart.items = cartItems;

                return await cart.save()
 
            }else{

               return await CartModel.create({
                    customerId,
                    items:[{product: { ...item}, unit: qty }]
                })
            }

        
    }
 
    async CreateNewOrder(customerId:string, txnId:string){

        //required to verify payment through TxnId

        const cart = await CartModel.findOne({ customerId: customerId })

        if(cart){         
            
            let amount = 0;   

            let cartItems = cart.items ;

            if(cartItems.length > 0){
                //process Order
                
                cartItems.map(item => {
                    amount += item.product.price * item.unit  
                });
    
                const orderId = uuidv4();
    
                const order = new OrderModel({
                    orderId,
                    customerId,
                    amount,
                    status: 'received',
                    items: cartItems
                })
    
                cart.items = [];
                
                const orderResult = await order.save();
                await cart.save();
                return orderResult;


            }

 

        }

        return {}
    }

}

