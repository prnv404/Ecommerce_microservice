import mongoose from "mongoose";

import { Customer, CustomerDoc } from "../model/customer-model";
import { Address } from "../model/address-model";
import { AddCartItemm, CreateAddress, CustomerInterfafce, Wishlist } from "../../types";

//Dealing with data base operations

export class CustomerRepository {

    async CreateCustomer(userInput: CustomerInterfafce) {
        
        const { email, password, phone, salt } = userInput

        const customer = new Customer({
            email,
            password,
            salt,
            phone,
            address: []
        })

        const customerResult = await customer.save();

        return customerResult;

    }
    
    async CreateAddress(userInput:CreateAddress) {
        
        const { _id, street, postalCode, city, country} = userInput
        
        const profile = await Customer.findById(_id);
        
        if(profile){
            
            const newAddress = new Address({
                street,
                postalCode,
                city,
                country
            })

            await newAddress.save();

            profile.address.push(newAddress);

            return await profile.save()  
            

        }

        
    }

    async FindCustomer(email:string){
        const existingCustomer = await Customer.findOne({ email: email });
        return existingCustomer;
    }

    async FindCustomerById(id:string){

        const existingCustomer = await Customer.findById(id).populate('address');
        // existingCustomer.cart = [];
        // existingCustomer.orders = [];
        // existingCustomer.wishlist = [];

        // await existingCustomer.save();
        return existingCustomer;
    }

    async Wishlist(customerId:string){

        const profile = await Customer.findById(customerId).populate('wishlist');
       
        if(profile) return  profile.wishlist
    }

    async AddWishlistItem(customerId:string, Input:Wishlist){
        
        const { _id, name, desc, price, available, banner} = Input

        const product = {
            _id, name, desc, price, available, banner
        };

        const profile = await Customer.findById(customerId).populate('wishlist');
       
        if(profile){

             let wishlist = profile.wishlist;
  
            if(wishlist.length > 0){
                let isExist = false;
                wishlist.map(item => {
                    if(item._id.toString() === product._id.toString()){
                       const index = wishlist.indexOf(item);
                       wishlist.splice(index,1);
                       isExist = true;
                    }
                });

                if(!isExist){
                    wishlist.push(product);
                }

            }else{
                wishlist.push(product);
            }

            profile.wishlist = wishlist;

            const profileResult = await profile.save();  
        
            return profileResult.wishlist;
                       

        }



    }


    async AddCartItem(customerId: string, Input:AddCartItemm, qty:number, isRemove:boolean) {

        const  { _id, name, price, banner} = Input
 
        const profile = await Customer.findById(customerId).populate('cart');


        if(profile){ 
 
            const cartItem = {
                product: { _id, name, price, banner },
                unit: qty,
            };
          
            let cartItems = profile.cart;
            
            if(cartItems.length > 0){
                let isExist = false;
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

                if(!isExist){
                    cartItems.push(cartItem);
                } 
            }else{
                cartItems.push(cartItem);
            }

            profile.cart = cartItems;

            return await profile.save();
        }
        
        throw new Error('Unable to add to cart!');
    }



    async AddOrderToProfile(customerId:string, order:string){
 
        const profile = await Customer.findById(customerId);

        if(profile){ 
            
            if(profile.orders == undefined){
                profile.orders = []
            }

            profile.orders.push(order);

            profile.cart = [];

            const profileResult = await profile.save();

            return profileResult;
        }
        
        throw new Error('Unable to add to order!');
    }

 


}

