  
import express from 'express';
import connect from './connectMongo';

import routes from './routes';

class AppController {
    public express;

    constructor() {
        this.express = express();
        connect();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json());
    }

    routes() {
        this.express.use(routes);
    }
}

export default new AppController().express;