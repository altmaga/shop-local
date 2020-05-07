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
                            name: req.body.name,
                            description: req.body.description,
                            composition: req.body.composition,
                            category: req.body.category,
                            forward: req.body.forward,
                            price: req.body.price,
                            reduction: req.body.reduction,
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
                            // if user is registered without errors
                            // create a token
                            const token = jwt.sign({
                                    id: user._id
                                },
                                process.env.JWT_SECRET, {
                                    expiresIn: 86400 // expires in 24 hours

                                });

                            return res.json({
                                msg: 'User created!',
                                data: user,
                                auth: true,
                                token: token,
                                err: null
                            });
                        })
                        .catch( mongoError => {
                            return res.json({
                                msg: 'User not created...',
                                data: null,
                                err: mongoError,
                                auth: false,
                                token: null
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
                                        const token = jwt.sign(
                                            { id: user._id }, process.env.JWT_SECRET, {
                                            expiresIn: 86400 // expires in 24 hours
                                        });
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
                        ShopModel.find( (mongoError, documents) => {
                            if( mongoError ){
                                return res.json( { msg: 'Shops not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Shops found!', data: documents, err: null } );
                            }
                        })
                    }
                    // USER LOGOUT
                    else if (req.params.endpoint === 'logout'){
                        res.status(200).send({ auth: false, token: null });
                    }
                })

                router.get('/me', VerifyToken, function(req, res, next) {

                    UserModel.findById(req.userId, { password: 0 }, function (err, user) {
                        if (err) return res.status(500).send("There was a problem finding the user.");
                        if (!user) return res.status(404).send("No user found.");
                        res.status(200).send(user);
                    });

                });
            //

            /*
            CRUD: Read one route
            */
                router.get('/:endpoint/:id', async (req, res) => {
                    // Check endpoint
                    if(req.params.endpoint === 'product'){
                        ProductModel.findById( req.params.id, (mongoError, document) => {
                            if( mongoError ){
                                return res.json( { msg: 'Product not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Product found!', data: document, err: null } );
                            }
                        });
                    }
                    else if(req.params.endpoint === 'shop'){
                        ShopModel.findById( req.params.id, (mongoError, document) => {
                            if( mongoError ){
                                return res.json( { msg: 'Shop not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Shop found!', data: document, err: null } );
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
                                document.name = req.body.name;
                                document.description = req.body.description;
                                document.composition = req.body.composition;
                                document.category = req.body.category;
                                document.forward = req.body.forward;
                                document.price = req.body.price;
                                document.reduction = req.body.reduction;
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