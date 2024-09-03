 import { Router } from "express"
 import {clientCollection } from "../models/index.js";
 
 //get all clients with their orders

export default ({ config , db}) => {
    let router = Router(); 

//add a client (when he fills all the infos )
    router.post('/addClient', async (req, res) => {
        try {
            const newClient = req.body;
            if (newClient.clientName && newClient.clientLastname && (newClient.num || newClient.email)){
                await clientCollection.create(newClient).then (res => {
                    res.send ({success: true , payload: res});
                })
            }else {
                res.send({success: false , payload: 'fill all infos'})
            }
        }catch(error){
            console.log(error)
            res.status(500).send({ success: false, payload: 'internal server error'})
        }
    })

//update the client infos 
    router.put('/updateClient/:clientname' , async (req , res)=> {
        try{
            const { clientname } = req.params
            if (!clientname){
                res.status(404).send({message : 'client name is required '})
            }else {
                const updatedClient = await clientCollection.findOneAndUpdate (
                    { clientName : clientname } , 
                    { $set : req.body } , 
                    { new : true }
                )
                console.log(updatedClient)
                if (updatedClient) {
                    res.status(200).send(updatedClient);
                } else {
                    res.status(404).send("Client doesn't exist. Please try again :)");
                }
            }

        }catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    })



//delete the client from db 
router.delete('/deleteClients/:clientname' , async (req , res) => {
    try {
        const {clientname} = req.params
        console.log(clientname)
        if (!clientname) {
            res.status(404).send({message : 'client name is required '})
        } else {
            const clientFound = await clientCollection.findOneAndDelete({ clientName : clientname })
            console.log(clientFound)
            if (clientFound) {
                res.status(200).send({message : 'client has been deleted'});
            } else {
                res.status(404).send("Client doesn't exist. Please try again :)");
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})
   
             
    return router;
}