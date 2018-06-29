import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';  // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import expressValidator from 'express-validator';
import generateConfig from './config';
import { initSequelize, syncDatabase } from './database';
import createDebug from 'debug';
import UserController from './controllers/user';
import AccountController from './controllers/account';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import { User } from './models/user';

const config = generateConfig();
const sequelize = initSequelize(config);

const debug = createDebug('ap:server');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new JwtStrategy({
        secretOrKey: process.env.SALT || 'ishu',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function (payload: any, done: any) {
        const user = await User.findById(payload.userId);
        if (!user) return done(null, false);
        done(null, user);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Create Express server
const app = express();


// Express configuration
app.set('port', process.env.PORT || 3000);

app.set('sequelize', sequelize);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(passport.initialize());

app.use((req, res, next) => {
    debug(`${req.method} ${req.url}`);
    next();
});

app.use('/v1', UserController);
app.use('/v1', AccountController);

/**
 * Primary app routes.
 */
app.get('/config', (req, res) => {
    syncDatabase();
    res.json(config);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    debug(`${req.url}: ${err.message}`);
    console.error(err);

    if (err.isBoom) {
        return res
            .status(err.output.statusCode || 500)
            .json(Object.assign(
                err.output.payload,
                err.data ? {details: err.data} : null
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