import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import logger from "./util/logger";
import lusca from "lusca";
import flash from "express-flash";
import expressValidator from "express-validator";
import generateConfig from './config';
import { initSequelize, syncDatabase } from './database';
import UserController from './controllers/user';
import createDebug from 'debug';

const config = generateConfig();
const sequelize = initSequelize(config);


const debug = createDebug('ap:server');

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

app.set('sequelize', sequelize);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use((req, res, next) => {
    debug(`${req.method} ${req.url}`);
    next();
});

app.use('/v1', UserController);

/**
 * Primary app routes.
 */
app.get('/config', (req, res) => {
    syncDatabase();
    res.json(config);
});

app.use((err, req, res, next) => {
    debug(`${req.url}: ${err.message}`);
    console.error(err);

    if (err.isBoom) {
        return res
            .status(err.output.statusCode || 500)
            .json(Object.assign(
                err.output.payload,
                err.data ? { details: err.data } : null
            ));
    }

    res.status(err.status || 500).json({
        statusCode: err.status || 500,
        error: err.name,
        message: err.message,
    });
});

app.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'No such route',
    });
});

export default app;