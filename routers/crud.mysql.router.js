/*
Imports
*/
    // Node
    const express = require('express');
    const router = express.Router();
//

/*
Routes definition
*/
    class CrudMongoRouterClass {

        // Inject Passport to secure routes
        constructor(connection) {
            // Instanciate MYsql connection
            this.connection = connection;
        }

        // Methode to get data from :endpoint and :id
        getDataFromid( endpoint, option ){
            return new Promise( (resolve, reject) => {
                // Get item by ID from table :endpoint
                this.connection.query(`SELECT * FROM ${endpoint} WHERE ${option}`, (queryError, results, fields) => {
                    return queryError ? reject(queryError) : resolve(results);
                });
            })
        }
        
        // Set route fonctions
        routes(){
            /* 
            CRUD: Create route 
            */
                router.post('/:endpoint', (req, res) => {
                    // Set empty data
                    let data = {};

                    // Check endpoint
                    if(req.params.endpoint === 'post'){
                        // Define post data
                        data = {
                            title: req.body.title,
                            content: req.body.content
                        }
                    }

                    // Insert item in table :endpoint
                    this.connection.query(`INSERT INTO ${req.params.endpoint} SET ?`, data, (queryError, results, fields) => {
                        if (queryError) {
                            return res.json({ msg: 'MYSQL: ok query', err: queryError })
                        }
                        else{
                            return res.json({ msg: 'MYSQL: OK query', results: results, fields: fields })
                        }
                    });
                })
            //

            /* 
            CRUD: Read all route 
            */
                router.get('/:endpoint', (req, res) => {
                    // Get all item from table :endpoint
                    this.connection.query(`SELECT * FROM ${req.params.endpoint}`, (queryError, results, fields) => {
                        if (queryError) {
                            return res.json({ msg: 'MYSQL: error query', err: queryError })
                        }
                        else{
                            return res.json({ msg: 'MYSQL: OK query', results: results, fields: fields })
                        }
                    });
                })
            //

            /* 
            CRUD: Read one route
            */
                router.get('/:endpoint/:id', async (req, res) => {

                    if( req.params.endpoint === 'post' ){
                        return Promise.all([
                            this.getDataFromid('post', `id=${req.params.id}`),
                            this.getDataFromid('comment', `subject=${req.params.id}`)
                        ])
                        .then( async allData => {
                            const author = await this.getDataFromid('users', `id=${allData[0][0].author}`)
                            return res.json({ msg: 'MYSQL: OK query', data: { post: allData[0], comments: allData[1], author: author } })
                        })
                        .catch( mysqlError => {
                            return res.json({ msg: 'MYSQL: error query', err: mysqlError })
                        });
                    }
                    else if(req.params.endpoint === 'users'){
                        return Promise.all([
                            this.getDataFromid('users', `id=${req.params.id}`),
                            this.getDataFromid('post', `author=${req.params.id}`),
                            this.getDataFromid('comment', `author=${req.params.id}`)
                        ])
                        .then( allData => {
                            return res.json({ msg: 'MYSQL: OK query', data: { user: allData[0], posts: allData[1], comments: allData[2] } })
                        })
                        .catch( mysqlError => {
                            return res.json({ msg: 'MYSQL: error query', err: mysqlError })
                        })
                    }
                })
            //

            /* 
            CRUD: Update route 
            */
                router.put('/:endpoint/:id', (req, res) => {
                    // Get all item from table :endpoint
                    this.connection.query(`
                        UPDATE ${req.params.endpoint} 
                        SET title = "${req.body.title}", content = "${req.body.content}" 
                        WHERE id = ${req.params.id}
                    `, (queryError, results, fields) => {
                        if (queryError) {
                            return res.json({ msg: 'MYSQL: error query', err: queryError })
                        }
                        else{
                            return res.json({ msg: 'MYSQL: OK query', results: results, fields: fields })
                        }
                    });
                })
            //

            /* 
            CRUD: Delete route 
            */
                router.delete('/:endpoint/:id', (req, res) => {
                    // Get all item from table :endpoint
                    this.connection.query(`
                        DELETE FROM ${req.params.endpoint} 
                        WHERE id = ${req.params.id}
                    `, (queryError, results, fields) => {
                        if (queryError) {
                            return res.json({ msg: 'MYSQL: error query', err: queryError })
                        }
                        else{
                            return res.json({ msg: 'MYSQL: OK query', results: results, fields: fields })
                        }
                    });
                })
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