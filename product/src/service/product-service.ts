import { ProductInterface, ProductPayload } from "../types";
import { ProductRepository } from "../database";
import { FormateData } from  '../utils'

// All Business logic will be here
export class ProductService {

    private repository;

    constructor(){
        this.repository = new ProductRepository();
    }
    

    async CreateProduct(productInputs:ProductInterface){

        const productResult = await this.repository.CreateProduct(productInputs)
        return FormateData(productResult);
    }
    
    async GetProducts(){
        const products = await this.repository.Products();

        type CategoryMap = { [key: string]: string }
        

        let categories:CategoryMap = {};

        products.map(({ type }) => {
            categories[type] = type ;
        });
        
        return FormateData({
            products,
            categories:  Object.keys(categories)  
           })

    }

    async GetProductDescription(productId:string){
        
        const product = await this.repository.FindById(productId);
        return FormateData(product)
    }

    async GetProductsByCategory(category:string){

        const products = await this.repository.FindByCategory(category);
        return FormateData(products)

    }

    async GetSelectedProducts(selectedIds:string[]){
        
        const products = await this.repository.FindSelectedProducts(selectedIds);
        return FormateData(products);

    }


    async GetProductPayload(userId:string,productInput:any,event:string){

        const { productId, qty } = productInput

         const product = await this.repository.FindById(productId);

        if(product){
             const payload = { 
                event: event,
                data: { userId, product, qty}
            };
 
             return FormateData(payload)
        }else{
            return FormateData({error: 'No product Available'});
        }

    }
 

}

