import 'reflect-metadata'; // We need this in order to use @Decorators
import config from '../config';
import express from 'express';
import cors from 'cors';
import Logger from './loaders/logger';

async function startServer() {
    const app = express();

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });

    app.use(cors());
    
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
