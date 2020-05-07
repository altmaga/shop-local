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
    const MYSQLClass = require('./services/mysql.class');
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
            // Instanciate MYSQL
            this.MYSQL = new MYSQLClass;
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
            // Connect the DB
            this.MYSQL.connectDb()
            .then( connection => {
                // Set global API router
                const ApiRouterClass = require('./routers/crud.mysql.router');
                const apiRouter = new ApiRouterClass(connection);
                server.use('/api', apiRouter.init());

                // Set auth router
                const AuthRouterClass = require('./routers/auth.router');
                const authRouter = new AuthRouterClass(connection);
                server.use('/api/auth', authRouter.init());

                // Set front router
                server.get('/*',  (req, res) => res.render('index') );

                // Launch server
                this.launch();
            })
            .catch( connectionError => {
                console.log(`MYsql connection error: ${connectionError}`)
            })
        };

        launch(){
            server.listen(port, () => {
                console.log(`Server is running: http://localhost:${port}`)
            })
        };
    }
//

/*
Start server
*/
    const NODEapi_boilerplate = new ServerClass();
    NODEapi_boilerplate.init();
//