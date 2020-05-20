/*
Import
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//


/*
Definition
*/
const bagSchema = new Schema({
    id_product: String,
    name: String,
    description: String,
    composition: [{
        name: String,
        quantity: String
    }],
    category: [{
        name: String
    }],
    current_price: String,
    starting_price: String,
    img: String,
    token: String
});
//

/*
Export
*/
const Bag = mongoose.model('bag', bagSchema);
module.exports = Bag;
//