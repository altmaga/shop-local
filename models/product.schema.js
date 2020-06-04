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
        /* Linked shop */
        shop_id: String,
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
        current_price: String,
        starting_price: String,
        img: String
    });
//

/*
Export
*/
    const Product = mongoose.model('product', productSchema);
    module.exports = Product;
//