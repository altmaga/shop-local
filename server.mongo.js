/* 
Imports
*/
    // NPM modules
    require('dotenv').config(); //=> https://www.npmjs.com/package/dotenv
    const express = require('express'); //=> https://www.npmjs.com/package/express
    const bodyParser = require('body-parser'); //=> https://www.npmjs.com/package/body-parser
    const cookieParser = require('cookie-parser'); //=> https://www.npmjs.com/package/cookie-parser
    const ejs = require('ejs'); //=> https://www.npmjs.com/package/ejs

    // NodeJS modules
    const path = require('path'); //=> https://www.npmjs.com/package/path

    // Inner modules
    const MONGOclass = require('./services/mongo.class');
//


/* 
Declarations
*/
    const server = express();
    const port = process.env.PORT;
//


/* 
Server class
*/
    class ServerClass{
        constructor(){
            // Instanciate MongoDB
            this.MONGO = new MONGOclass;
        }

        init(){
            server.engine( 'html', ejs.renderFile );
            server.set( 'view engine', 'html' );
            
            // Static path configuration
            server.set( 'views', __dirname + '/www' );
            server.use( express.static(path.join(__dirname, 'www')) );

            //=> Body-parser
            server.use(bodyParser.json({limit: '10mb'}));
            server.use(bodyParser.urlencoded({ extended: true }));

            //=> Use CookieParser to setup serverside cookies
            server.use(cookieParser(process.env.COOKIE_SECRET));

            // Start server configuration
            this.config();
        };

        config(){
            // Set auth router
            const CrudMongoRouterClass = require('./routers/crud.mongo.router');
            const crudMongoRouter = new CrudMongoRouterClass();
            server.use('/api/mongo', crudMongoRouter.init());

            // Set front router
            server.get('/*',  (req, res) => res.render('index') );

            // Launch server
            this.launch();
        };

        launch(){
            // Start MongoDB connection
            this.MONGO.connectDb()
            .then( db => {
                // Start server
                server.listen(port, () => {
                    console.log({
                        node: `http://localhost:${port}`,
                        mongo: db
                    });
                });
            })
            .catch( dbErr => console.log('MongoDB Error', dbErr));
        };
    }
//

/* 
Start server
*/
    const NODEapi_boilerplate = new ServerClass();
    NODEapi_boilerplate.init();
//