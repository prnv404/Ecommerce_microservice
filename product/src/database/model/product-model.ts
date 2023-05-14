import mongoose from 'mongoose';

const Schema = mongoose.Schema;


export interface ProductDoc extends mongoose.Document {
    name: string,
    dec: string,
    banner: string,
    type: string,
    unit: number
    price:number
    available: boolean
    suplier:string
}




const ProductSchema = new Schema({
    name: String,
    desc: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    available: Boolean,
    suplier: String
});

export const Product = mongoose.model<ProductDoc>("Product", ProductSchema)


