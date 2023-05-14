import mongoose from 'mongoose';
import { ProductInterface } from './shopping-model';
 
const Schema = mongoose.Schema;


export interface CartItem {
    product: {
      _id: string;
      name: string;
      desc: string;
      banner: string;
      type: string;
      unit: number;
      price: number;
      suplier: string;
    };
    unit: number;
  }

interface CartDoc extends mongoose.Document {
    customerId: string
    items: CartItem[]
}


const CartSchema = new Schema({
    customerId: { type: String },
    items: [
        {   
            product: {
                _id: { type: String, require: true},
                name: { type: String },
                desc: { type: String },
                banner: { type: String },
                type: { type: String },
                unit: { type: Number },
                price: { type: Number },
                suplier: { type: String },
            } ,
            unit: { type: Number, require: true} 
        }
    ]
});

export const CartModel =  mongoose.model<CartDoc>('cart', CartSchema);
