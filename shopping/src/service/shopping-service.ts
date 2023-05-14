import { ShoppingRepository } from "../database";
import { FormateData } from "../utils";

// All Business logic will be here
export class ShoppingService {

    private repository : ShoppingRepository

    constructor(){
        this.repository = new ShoppingRepository();
    }

    async GetCart( _id :string){
        
        const cartItems = await this.repository.Cart(_id);
        return FormateData(cartItems);
    }


    async PlaceOrder(userInput:any){

        const { _id, txnNumber } = userInput

        const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
        
        return FormateData(orderResult);
    }

    async GetOrders(customerId:any){
        
        const orders = await this.repository.Orders(customerId);
        return FormateData(orders)
    }

    async GetOrderDetails( _id:string){
        const orders = await this.repository.Orders(_id);
        return FormateData(orders)
    }

    async ManageCart(customerId:string, item:any,qty:number, isRemove:boolean){

        const cartResult = await this.repository.AddCartItem(customerId,item,qty, isRemove);
        return FormateData(cartResult);
    }
     

    async SubscribeEvents(payload:any){
 
        payload = JSON.parse(payload);
        const { event, data } = payload;
        const { userId, product, qty } = data;
        
        switch(event){
            case 'ADD_TO_CART':
                this.ManageCart(userId,product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product, qty, true);
                break;
            default:
                break;
        }
 
    }


    async GetOrderPayload(userId:string,order:any,event:string){

       if(order){
            const payload = { 
               event: event,
               data: { userId, order }
           };

            return payload
       }else{
           return FormateData({error: 'No Order Available'});
       }

   }

 

}

