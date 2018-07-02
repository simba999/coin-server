import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import expressValidator from 'express-validator';
import generateConfig from './config';
import { initSequelize } from './database';
import UserController from './controllers/user';
import AccountController from './controllers/account';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import { User } from './models/user';

const config = generateConfig();
const sequelize = initSequelize(config);

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new JwtStrategy({
        secretOrKey: process.env.SALT || 'ishu',
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
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
    console.info(`${new Date()}: [${req.method}] ${req.url}`);
    next();
});

app.use('/v1', UserController);
app.use('/v1', AccountController);

/**
 * Primary app routes.
 */
app.get('/config', (req, res) => {
    res.json(config);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`${req.url}: ${err.message}`);

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