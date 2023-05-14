import mongoose from 'mongoose';
import { Product } from '../model/product-model'
import { ProductInterface } from '../../types';

// Dealing with data base operations
export class ProductRepository {

    async CreateProduct(Input:ProductInterface){
        const { name, desc, type, unit,price, available, suplier, banner } = Input
        const product = new Product({
            name, desc, type, unit,price, available, suplier, banner
        })

    //    return await Product.findByIdAndDelete('607286419f4a1007c1fa7f40');

        const productResult = await product.save();
        return productResult;
    }


     async Products(){
        return await Product.find();
    }
   
    async FindById(id:string){
        
       return await Product.findById(id);

    }

    async FindByCategory(category:string){

        const products = await Product.find({ type: category});

        return products;
    }

    async FindSelectedProducts(selectedIds:string[]){
        const products = await Product.find().where('_id').in(selectedIds.map(_id => _id)).exec();
        return products;
    }
    
}

