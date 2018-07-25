import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
import generateConfig from './config';
import { initSequelize } from './database';
import UserController from './controllers/user';
import AccountController from './controllers/account';
import CaptableController from './controllers/captable';
import SecurityController from './controllers/security';
import SecurityTransactionController from './controllers/security_transactions';
import ShareHolderController from './controllers/shareholder';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import { User } from './models/user';

const config = generateConfig();
const sequelize = initSequelize(config);

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new JwtStrategy({
        secretOrKey: config.secrets.salt,
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

const app = express();

app.set('port', config.port);
app.set('sequelize', sequelize);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(cors({origin: '*'}));
app.use(passport.initialize());

app.use((req, res, next) => {
    console.info(`${new Date()}: [${req.method}] ${req.url}`);
    next();
});

app.use('/v1', UserController);
app.use('/v1', AccountController);
app.use('/v1', CaptableController);
app.use('/v1', SecurityController);
app.use('/v1', SecurityTransactionController);
app.use('/v1', ShareHolderController);

app.get('/config', (req, res) => {
    res.json(config);
});

app.get('/ping', (req, res) => {
    res.sendStatus(204);
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