 import { Router, response } from "express";
 import { orderCollection } from "../models/index.js";
 import {clientCollection } from "../models/index.js";
 import { productCollection } from "../models/index.js";
 

export default ({ config , db}) => {
    let router = Router(); 

//create a new order ki yaebaz 3la confirmer la commande 
//L'API permet de créer une nouvelle commande à partir des informations du panier (produits, quantités, prix)
//Elle associe la commande à un client spécifique et génère un numéro de commande unique
    router.post('/createOrder' , async (req, res) => {
        try {
            const newOrder = req.body ;
            if (newOrder.clientId && newOrder.products){
                 await orderCollection.create(newOrder).then (response => {
                    res.send ({success: true, payload: response})
                })
            } else {
                throw new Error("please fill all the infos")
            }
        } catch (err) {
            console.log(err)
            res.status(400).send ({
                message : 'Internal server error',
                success : false 

            })
        }
    })


 

 //get all orders of a specific client (by his name ici on doit relier client et order )
   router.get('/getOrdersFromUsers/:clientname' , async (req , res) => {

    const {clientname} = req.params
    console.log(clientname)
    if (clientname) {
    try{
        // we can't do findone.aggregate at the same time we have first to find that person then use the aggregation on the clientCollection
        // so we don't need to use clientCollection.findOne we can only use  $match and let only le client tae params li yakoun displays
        const clientFound =  await clientCollection.findOne({ clientName : clientname })
        console.log(clientFound)
        
         if (clientFound) {
            const clientOrders = await clientCollection.aggregate([
                { $match: { clientName: clientname } }, // the client li yakoun fel params will be the only one li yakoun displayed :D , sinon it will displays all the clients
                {
                    $lookup : {
                        from : 'orders',
                        localField : '_id',
                        foreignField : 'clientId',
                        as : 'orderProducts'
                    }
                },
               
                {
                    $project : {
                        clientName : 1 ,
                        clientLastname : 1 ,
                        num : 1 ,
                        'orderProducts.products' : 1 ,
                    }
                },
                {
                    $unwind : '$orderProducts'
                },
                {
                    $unwind : '$orderProducts.products'
                }
            ]
            )
            console.log(clientOrders)
            res.send(clientOrders)
        }else {
            res.status(404).json({ message: 'Client not found' });
        }}catch (error) {
            console.error('Error fetching client:', error);
            res.status(500).json({ message: 'Internal server error' });
        } 
    }
    
 }) 
 //get all orders of a specific product (by the name on doit relier product et order)
 router.get('/getOrdersProducts/:productname' , async (req , res) => {

    const {productname} = req.params
    console.log(productname)
    if (productname) {
    try{
        const productFound = await productCollection.findOne({ name : productname })
        console.log(productFound)
        if (productFound){
          const clientOrders = await productCollection.aggregate([
            
                { $match: { name : productname } },
                {
                    $lookup : {
                        from : 'orders',
                        localField : '_id',
                        foreignField : 'products.product_id',
                        as : 'Products'
                    },
                },  
                {
                    $unwind : '$Products'
                },
                {
                    $unwind : '$Products.products'
                },
                {
                    $match : {  
                        $expr :{$eq : ["$_id" ,"$Products.products.product_id", ]}
                    }
                },
                {
                    $project : {
                        name : 1 ,
                        category : 1 ,
                        isStocked : 1 ,
                        "Products.orderId" : 1 ,
                        "Products.totalPrice" : 1,
                        "Products.status" : 1 ,
                        "Products.clientId" : 1 ,
                        "Products.products" : 1

                        

                         
                    }
                }
            ])
            console.log(clientOrders)
            res.send(clientOrders)
        } else {
            res.status(404).json({ message: `Product with this name ${productname} is not found `});
        }
    }
    catch (error) {
            console.error('Error fetching client:', error);
            res.status(500).json({ message: 'Internal server error' });
    } 
    }
    
 }) 

 //update order 
 //L'API permet de modifier l'état d'une commande (en cours de traitement, expédiée, livrée, annulée)
 router.put('/updateOrder/:orderID' , async(req , res) => {
    try{
    const {orderID} = req.params
     console.log(orderID)
    if (orderID) {
       const updatedOrder = await orderCollection.findOneAndUpdate(
            { orderId: orderID} , 
            { $set: req.body } , //to update specific fields in the order
            { new: true } //Return the updated document
        );
        console.log(updatedOrder)
        if (updatedOrder) {
            res.status(200).send(updatedOrder);
        } else {
            res.status(404).send("Order doesn't exist. Please try again :)");
        }
    }else {
        res.status(404).send(" Order ID is required")
    }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
 })

 //get the total revenue of all orders 

 //delete order when he click on "annuler la commande "

router.delete('/deleteorder/:orderID', async(req, res) => {
    try {
        const {orderID} = req.params
        console.log(orderID)
        if (!orderID){
            return res.status(400).send({ message: 'order ID is required' });
        }else {
            const deletedOrder = await orderCollection.findOneAndDelete({ orderId : orderID})
            if (deletedOrder) {
                res.status(200).send({message : 'the order has been deleted'});
            } else {
                res.status(404).send("Order doesn't exist. Please try again :)");
            }
        }

    }catch (err){
        console.log(err)
        res.status(500).send({ message: 'Internal server error' });
    }

}
)

   return router;
}
 


 