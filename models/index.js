import mongoose from "mongoose";
import clientSchema from "./schema/clientSchema.js"
import productSchema from "./schema/productSchema.js"
import orderSchema from "./schema/orderSchema.js" //de preferance we add .js

export const clientCollection = mongoose.model("clients"  , clientSchema)

export const productCollection = mongoose.model("products" , productSchema)

export const orderCollection = mongoose.model("orders" , orderSchema)

