import mongoose from "mongoose";

let Schema = mongoose.Schema

let clientSchema = new Schema(
{
    clientName: {type: String, required: true},
    clientLastname : {type: String, required: true},
    email: {type: String, required: true, unique: true},
    num : {type: Number, required: true , unique: true},
    address: {
        wilaya : {type : String } , 
        commune : {type : String } ,
        street : {type : String } ,
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
     

});
export default clientSchema

