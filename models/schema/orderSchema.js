import mongoose from "mongoose";

let Schema = mongoose.Schema;

let orderSchema = new Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref:'Client'  , required: true },
    orderId : {type : Number},
    products: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: {type: Number, required: true},
        
    }],
    totalPrice: {type: Number, required: true},
    orderDate: {type: Date, default: Date.now},
    status: {type: String, enum: ['Pending', 'Shipped', 'Delivered' ], default: 'Pending'}

});

export default orderSchema