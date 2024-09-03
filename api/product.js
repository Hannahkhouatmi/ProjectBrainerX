import { Router } from "express";
import {productCollection} from '../models/index.js'


export default ({ config , db}) => {
    let router = Router();

    //create a new product (admin only)
    router.post('/createProduct' , async (req, res) => {
            let exeption = { message : "please fill all the infos" , code : 50}
        try {
            const newProduct = req.body ;
            if (newProduct.name && newProduct.price && newProduct.quantity && newProduct.category && newProduct.description && newProduct.imageUrl){
                const products = await productCollection.create(newProduct).then (response => {
                    res.send ({success: true, payload: response})
                })
            } else {
                throw exeption
            }
        } catch (e){
            if (e == exeption){
                res.Send ({e})
            }
            else if ( e && e.code === 11000){
                res.status(400).send({
                    success: false,
                    message: "Product with this name already exists"
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: "Error while creating product"
                })

            }
        }
    
    }
    );
   
    //get product depends on name (naewad nwali liha) 
  
    router.get('/getProductbyname/:name', async (req, res) => {
        
            const { name } = req.params
          

            if (name) {
                const product = await productCollection.findOne({ name: name });
                try{
                    if (!product) {
                         res.status(404).send({message: `product with this name (${name}) doesnt exist`});
                    
                    }
                    else {
                         res.json(product);
                    }
                 }
                catch (err) {
                    res.status(500).json({ message: "Error fetching products" });
                }
            }
            else {
                res.status(400).send({ message: 'You have to specify a product name' })
            }
    })

    //get product depens on the category
    router.get('/getProductbycategory/:category', async (req, res) => {
        const { category } = req.params
        if (category) {
            const products = await productCollection.find({ category: category });
            try{
                if (!products) {
                    res.status(404).send({message: `No products found under this category ${category}`});
                }
                else {
                    res.json(products);
                }
            }
            catch (err) {
                res.status(500).json({ message: "Error fetching products" });
            }
        }
        else {
            res.status(400).send({ message: 'You have to specify a product category' })
        }
    })

    

    //get all products 
    router.get('/getAllProducts' , async (req, res) => {
        try {
           const products = await productCollection.find()
                res.send(products)

            }
            catch (err){ 
                console.log(err) 
                res.status(400).send ({
                    message : 'Internal server error',
                    success : false 
    
                })
             
            }
        })
     
    //update product (admin only)
 
    router.put('/updateproduct/:name' , async (req, res) => {
        try{
              const {name} = req.params
              const product = await productCollection.find({name : name}).updateMany(req.body)
  
              if (!name) {
                  res.status(404).send({message :`there is no product with this name ${name}`} )
              }
              console.log(product)
              const updatedproduct = await productCollection.find({name : name})
              res.status(200).send(updatedproduct)
          }catch(err) {
              console.log(err)
              res.status(500).send(err)
          }
      })
    

    //delete product (admin only)
    router.delete('/deleteproduct/:name' , async (req, res) => {
        try{
            const {name} = req.params
            const product = await productCollection.find({name : name}).deleteMany()

            if (!name) {
                res.status(404).send({message :`there is no product with this name ${name}`} )
            }

            res.status(200).send( {message : 'deleted successfully'})
            
        }catch(err) {
            console.log(err)
            res.status(500).send(err)
        }
    })

    //--------------------------------------------------------------
    
                
    

    return router;
    return router
}