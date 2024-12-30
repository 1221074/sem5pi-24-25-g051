import 'reflect-metadata'; // We need this in order to use @Decorators
import config from '../config';
import express from 'express';
import cors from 'cors';
import Logger from './loaders/logger';

async function startServer() {
    const app = express();

    // CORS Configuration
    const corsOptions: cors.CorsOptions = {
        origin: 'http://localhost:4000', // Allow requests only from this origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed request methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        credentials: false, // Allow cookies if needed
    };


    // Middleware
    app.use(cors(corsOptions));

     // Opcional: Para permitir pré-verificações CORS (preflight requests)
     app.options('*', cors(corsOptions));


    await require('./loaders').default({ expressApp: app });

    app.listen(config.port, () => {

        console.log("Server listening on port: " + config.port);

        Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
    })
        .on('error', (err) => {
            Logger.error(err);
            process.exit(1);
            return;
        });
}

startServer();
