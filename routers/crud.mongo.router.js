/*
Imports
*/
    // Node
    const express = require('express');
    const router = express.Router();
    const passport = require('passport');

    // Inner
    const ProductModel = require('../models/product.schema');
    const ShopModel = require('../models/shop.schema');
    const UserModel = require('../models/user.schema');
    const BagModel = require('../models/bag.schema');

    /**
     * Configure JWT
     */
    const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
    const bcrypt = require('bcryptjs');

    const VerifyToken = require('../services/VerifyToken');
//

/*
Routes definition
*/
    class CrudMongoRouterClass {

        // Inject Passport to secure routes
        constructor() {}

        // Set route fonctions
        routes(){

            /*
            CRUD: Create route
            */
                router.post('/:endpoint', (req, res) => {
                    // Set empty data
                    let data = {};

                    // Check endpoint
                    // PRODUCT
                    if(req.params.endpoint === 'product'){
                        // Define post data
                        data = {
                            shop_id: req.body.shop_id,
                            name: req.body.name,
                            description: req.body.description,
                            composition: req.body.composition,
                            category: req.body.category,
                            forward: req.body.forward,
                            current_price: req.body.current_price,
                            starting_price: req.body.starting_price,
                            img: req.body.img
                        }

                        // MONGODB Create new document in 'products' collection
                        ProductModel.create(data)
                        .then( document => {
                            return res.json( { msg: 'Product created!', data: document, err: null } );
                        })
                        .catch( mongoError => {
                            return res.json( { msg: 'Product not created...', data: null, err: mongoError } );
                        });
                    }
                    // SHOP
                    else if(req.params.endpoint === 'shop'){
                        // Define post data
                        data = {
                            name: req.body.name,
                            baseline: req.body.baseline,
                            logo: req.body.logo,
                            items: req.body.items,
                            img: req.body.img,
                            informations: req.body.informations,
                            hours: req.body.hours
                        }

                        // MONGODB Create new document in 'shops' collection
                        ShopModel.create(data)
                        .then( document => {
                            return res.json( { msg: 'Shop created!', data: document, err: null } );
                        })
                        .catch( mongoError => {
                            return res.json( { msg: 'Shop not created...', data: null, err: mongoError } );
                        });
                    }
                    // BAG
                    else if (req.params.endpoint === 'bag'){
                        // Define post data
                        data = {
                            id_product: req.body.id_product,
                            name: req.body.name,
                            description: req.body.description,
                            composition: req.body.composition,
                            category: req.body.category,
                            current_price: req.body.current_price,
                            starting_price: req.body.starting_price,
                            img: req.body.img,
                            token: req.body.token
                        }

                        // MONGODB Create new document in 'bags' collection
                        BagModel.create(data)
                        .then( document => {
                            return res.json( { msg: 'Add to bag!', data: document, err: null } );
                        })
                        .catch( mongoError => {
                            return res.json( { msg: 'No adding in bag', data: null, err: mongoError } );
                        });
                    }
                    // USER
                    else if(req.params.endpoint === 'register'){
                        // Define post data
                        data = {
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password,
                            createdDate: req.body.createdDate
                        }

                        // MONGODB Create new user in 'user' collection
                        UserModel.create(data)
                        .then( user => {
                            return res.json({
                                msg: 'User created!',
                                data: user
                            });
                        })
                        .catch( mongoError => {
                            return res.json({
                                msg: 'User not created...',
                                data: null,
                                err: mongoError
                            });
                        });
                    }
                    else if(req.params.endpoint === 'login'){
                        // Check if email exist or not
                        UserModel.findOne({'email': req.body.email}, (mongoError, user) => {
                            if (mongoError) return res.status(500).send('Error on the server.');
                            if(!user){
                                return res.json({
                                    msg: 'Login failed, email not valid...'
                                })
                            }
                            else {
                                // If email is present then it will compare
                                user.comparePassword(req.body.password, (mongoError, isMatch) => {
                                    if(mongoError) {
                                        throw mongoError;
                                    }
                                    if(!isMatch) {
                                        return res.status(400).json({
                                            msg: 'Wrong password'
                                        });
                                    }
                                    else {
                                        // if user is found and password is valid
                                        // create a token
                                        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                                            expiresIn: 86400 // expires in 24 hours
                                        });
                                        // res.status(200).send('Logged successfully !')
                                        res.status(200).json({
                                            msg: 'User logged successfully',
                                            data: user,
                                            auth: true,
                                            token: token
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
            //

            /*
            CRUD: Read all route
            */

                router.get('/me', VerifyToken, (req, res) => {
                    UserModel.findById(req.userId, { password: 0 }, (err, user) => {
                        if (err) {
                            return res.status(500).send({
                                msg: "There was a problem finding the user"
                            });
                        }
                        if (!user) {
                            return res.status(404).send({
                                msg: "No user found"
                            });
                        }
                        else {
                            res.status(200).json({
                                msg: "User found !",
                                data: user
                            });
                        }
                    });
                });

                router.get('/:endpoint', (req, res) => {
                    // PRODUCT
                    if(req.params.endpoint === 'product'){
                        // Get all item from table :endpoint
                        ProductModel.find( (mongoError, documents) => {
                            if( mongoError ){
                                return res.json( { msg: 'Products not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Products found!', data: documents, err: null } );
                            }
                        })
                    }
                    // SHOP
                    else if(req.params.endpoint === 'shop'){
                        // Get all item from table :endpoint
                        ShopModel.find((mongoError, documents) => {
                            if( mongoError ){
                                return res.json( { msg: 'Shops not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Shops found!', data: documents, err: null } );
                            }
                        })
                    }
                    // SHOP
                    else if(req.params.endpoint === 'bag'){
                        // Get all item from table :endpoint
                        BagModel.find( (mongoError, documents) => {
                            if( mongoError ){
                                return res.json( { msg: 'Bags not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Bags found!', data: documents, err: null } );
                            }
                        })
                    }
                    // USER LOGOUT
                    else if (req.params.endpoint === 'logout'){
                        res.status(200).send({
                            auth: false,
                            token: null
                        });
                    }
                });
            //

            /*
            CRUD: Read one route
            */
                router.get('/:endpoint/:id', async (req, res) => {
                    // Check endpoint
                    if(req.params.endpoint === 'product'){
                        ProductModel.findById( req.params.id, (mongoError, ProductData) => {
                            if( mongoError ){
                                return res.json( { msg: 'Product not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Product found!', data: ProductData, err: null } );
                            }
                        });
                    }
                    else if(req.params.endpoint === 'shop'){
                        ShopModel.findById( req.params.id, (mongoError, ShopData) => {
                            if( mongoError ){
                                return res.json( { msg: 'Shop not found...', data: null, err: mongoError });
                            }
                            else {
                                // Retourner les produits liées au shop
                                ProductModel.find({shopId: req.params.shop_id}, (mongoError, shopProduct) => {
                                    if(mongoError) {
                                        return res.json( { msg: 'Product of shop not found...', data: null, err: mongoError });
                                    } else {
                                        return res.json( { msg: 'Shop & product found!', data: {shop: ShopData, shopProducts: shopProduct}, err: null } );
                                    }
                                })
                                // return res.json( { msg: 'Shop found!', data: ShopData, err: null } );
                            }
                        });
                    }
                    else if(req.params.endpoint === 'bag'){
                        BagModel.findById( req.params.id, (mongoError, BagData) => {
                            if( mongoError ){
                                return res.json( { msg: 'Bag not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Bag found!', data: BagData, err: null } );
                            }
                        });
                    }
                })
            //

            /*
            CRUD: Update route
            */
                router.put('/:endpoint/:id', (req, res) => {
                    // Check endpoint
                    // PRODUCT
                    if(req.params.endpoint === 'product'){
                        ProductModel.findById( req.params.id, (mongoError, document) => {
                            if( mongoError ){
                                return res.json( { msg: 'Product not found...', data: null, err: mongoError });
                            }
                            else{
                                // Update documeent data
                                document.shop_id = req.body.shop_id,
                                document.name = req.body.name;
                                document.description = req.body.description;
                                document.composition = req.body.composition;
                                document.category = req.body.category;
                                document.forward = req.body.forward;
                                document.current_price = req.body.current_price;
                                document.starting_price = req.body.starting_price;
                                document.img = req.body.img;

                                // Save document
                                document.save()
                                .then( updatedDocument => {
                                    return res.json( { msg: 'Product updated!', data: updatedDocument, err: null } );
                                })
                                .catch( mongSaveError => {
                                    return res.json( { msg: 'Product not updated...', data: null, err: mongSaveError });
                                });
                            };
                        });
                    }
                    // SHOP
                    else if(req.params.endpoint === 'shop'){
                        ShopModel.findById( req.params.id, (mongoError, document) => {
                            if( mongoError ){
                                return res.json( { msg: 'Shop not found...', data: null, err: mongoError });
                            }
                            else{
                                // Update documeent data
                                document.name = req.body.name,
                                document.baseline = req.body.baseline,
                                document.logo = req.body.logo,
                                document.items = req.body.items,
                                document.img = req.body.img,
                                document.informations = req.body.informations,
                                document.hours = req.body.hours

                                // Save document
                                document.save()
                                .then( updatedDocument => {
                                    return res.json( { msg: 'Shop updated!', data: updatedDocument, err: null } );
                                })
                                .catch( mongSaveError => {
                                    return res.json( { msg: 'Shop not updated...', data: null, err: mongSaveError });
                                });
                            };
                        });
                    }
                    // BAG
                    else if(req.params.endpoint === 'bag'){
                        BagModel.findById( req.params.id, (mongoError, document) => {
                            if( mongoError ){
                                return res.json( { msg: 'Bag not found...', data: null, err: mongoError });
                            }
                            else{
                                // Update documeent data
                                document.id_product = req.body.id_product,
                                document.name = req.body.name;
                                document.description = req.body.description;
                                document.composition = req.body.composition;
                                document.category = req.body.category;
                                document.current_price = req.body.current_price;
                                document.starting_price = req.body.starting_price;
                                document.img = req.body.img;

                                // Save document
                                document.save()
                                .then( updatedDocument => {
                                    return res.json( { msg: 'Bag updated!', data: updatedDocument, err: null } );
                                })
                                .catch( mongSaveError => {
                                    return res.json( { msg: 'Bag not updated...', data: null, err: mongSaveError });
                                });
                            };
                        });
                    }
                });
            //

            /*
            CRUD: Delete route
            */
                router.delete('/:endpoint/:id', (req, res) => {
                    // PRODUCT
                    if(req.params.endpoint === 'product') {
                        ProductModel.findOneAndDelete({ _id: req.params.id }, ( mongoError, mongoSucces ) => {
                            if( mongoError ){
                                return res.json( { msg: 'Product not deleted...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Product deleted!', data: mongoSucces, err: null } );
                            }
                        });
                    }
                    // SHOP
                    else if(req.params.endpoint === 'shop') {
                        ShopModel.findOneAndDelete({ _id: req.params.id }, ( mongoError, mongoSucces ) => {
                            if( mongoError ){
                                return res.json( { msg: 'Shop not deleted...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Shop deleted!', data: mongoSucces, err: null } );
                            }
                        });
                    }
                    // BAG
                    else if(req.params.endpoint === 'bag') {
                        BagModel.findOneAndDelete({ _id: req.params.id }, ( mongoError, mongoSucces ) => {
                            if( mongoError ){
                                return res.json( { msg: 'Bag not deleted...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Bag deleted!', data: mongoSucces, err: null } );
                            }
                        });
                    }
                });
            //
        };

        // Start router
        init(){
            // Get route fonctions
            this.routes();

            // Sendback router
            return router;
        };
    };
//

/*
Export
*/
    module.exports = CrudMongoRouterClass;
//