import mongoose from "mongoose";

let Schema = mongoose.Schema;

const productSchema = new Schema (
    {
        name: {type: String, required: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
        category: {type: String, required: true},
        description: {type: String, required: true},
        imageUrl: {type: String, required: true},
        isStocked : {type: Boolean, required: true}
    });
export default productSchema