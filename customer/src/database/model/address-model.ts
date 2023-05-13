import mongoose from "mongoose";


const Schema = mongoose.Schema;

interface AddressDoc extends mongoose.Document {
    street:string,
    postalCode:string,
    city:string,
    country:string
}

const AddressSchema = new Schema({
    street: String,
    postalCode: String,
    city: String,
    country: String
});

export const Address = mongoose.model<AddressDoc> ('Address', AddressSchema);