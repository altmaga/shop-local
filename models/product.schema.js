/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//


/*
Definition
*/
    const productSchema = new Schema({
        name: String,
        description: String,
        composition: [{
            name: String,
            quantity: String
        }],
        category: [{
            name: String
        }],
        forward: Boolean,
        price: String,
        reduction: String,
        img: String
    });
//

/*
Export
*/
    const Product = mongoose.model('product', productSchema);
    module.exports = Product;
//