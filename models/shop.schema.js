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
        baseline: String,
        logo: String,
        items: [{
            item: String
        }],
        img: String,
        informations: {
            address: String,
            cp: String,
            tel: String,
            instagram: String,
            facebook: String,
            site: String
        },
        hours: [
            {
                day: String,
                hour: String
            }
        ]
    });
//

/*
Export
*/
    const Shop = mongoose.model('shop', ShopSchema);
    module.exports = Shop;
//