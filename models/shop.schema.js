/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//


/*
Definition
*/
    const ShopSchema = new Schema({
        name: String,
        description: String,
        address: String,
        tel: String,
        hours: String,
        site: String,
        img: String
    });
//

/*
Export
*/
    const Shop = mongoose.model('shop', ShopSchema);
    module.exports = Shop;
//