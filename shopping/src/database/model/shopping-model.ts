import mongoose from 'mongoose';

const Schema = mongoose.Schema;


export interface ProductInterface {
    _id: string
    name: string,
    desc: string,
    banner: string,
    type: string,
    unit: number
    price: number
    suplier: string,
}

export interface Items extends ProductInterface{
    product: ProductInterface
    unit :number
}


export interface OrderDoc extends mongoose.Document{
    orderId: string
    customerId: string
    amount: number
    status: string
    items:Items
}

const OrderSchema = new Schema({
    orderId: { type: String },
    customerId: { type: String },
    amount: { type: Number },
    status: { type: String },
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
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

export const OrderModel =  mongoose.model<OrderDoc>('order', OrderSchema);
