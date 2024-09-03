import { Router } from "express";
import product from "./product.js";
import order from "./order.js";
import client from "./client.js";


export default ({ config , db}) => {
    let api = Router();

    api.use('/product', product({ config , db}));

    api.use('/order', order({ config , db}));

    api.use('/client', client({ config , db}));

   

    return api;  // Return the router instance.
}