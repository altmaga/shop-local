/*
Imports
*/
    // Node
    const express = require('express');
    const router = express.Router();

    // Inner
    const ProductModel = require('../models/product.schema');
    const ShopModel = require('../models/shop.schema');
    const UserModel = require('../models/user.schema');
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

                        // MONGODB Create new document in 'user' collection
                        UserModel.create(data)
                        .then( document => {
                            return res.json({
                                msg: 'User created!',
                                data: document,
                                err: null
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
                        UserModel.findOne({'email': req.body.email}, (mongoError, document) => {
                            if(!document){
                                return res.json({msg: 'Login failed, email not valid...'})
                            }
                            // If email is present then it will compare
                            document.comparePassword(req.body.password, (mongoError, isMatch) => {
                                if(mongoError) {
                                    throw mongoError;
                                }
                                if(!isMatch) {
                                    return res.status(400).json({
                                        msg: 'Wrong password'
                                    });
                                }
                                else {
                                    // res.status(200).send('Logged successfully !')
                                    res.status(200).json({
                                        msg: 'User logged successfully',
                                        data: document
                                    })
                                }
                            })
                        })
                        // UserModel.findOne({'email': req.body.email}, (err,user) => {
                        //     if(!user) {
                        //         return res.json({"Status":"Email Not Valid"})
                        //     }
                        //     else {
                        //         user.comparePassword(req.body.password, (err, isMatch) => {
                        //             if(!isMatch) {
                        //                 return res.json({"Status":"Password Failed"});
                        //             }
                        //             user.generateToken((err,user)=>{
                        //                 if(err) return res.status(400).send(err);
                        //                 // res.cookie('ths_auth',user.token).status(200).json({"Login Success":"True"});
                        //                 res.status(200).json({
                        //                     msg: "Login",
                        //                     token: user.token
                        //                 });
                        //             });
                        //         })
                        //     }
                        // })
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
                    // USER
                    else if(req.params.endpoint === 'register'){
                        // Get all item from table :endpoint
                        UserModel.find( (mongoError, documents) => {
                            if( mongoError ){
                                return res.json( { msg: 'Users not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'Users found!', data: documents, err: null } );
                            }
                        })
                    }
                })
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
                    else if(req.params.endpoint === 'register'){
                        UserModel.findById( req.params.id, (mongoError, document) => {
                            if( mongoError ){
                                return res.json( { msg: 'User not found...', data: null, err: mongoError });
                            }
                            else{
                                return res.json( { msg: 'User found!', data: document, err: null } );
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