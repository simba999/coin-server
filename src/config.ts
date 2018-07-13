import dotenv from 'dotenv';

export default function generateConfig(dotenvPath = '.env') {
    const env = dotenv.config({path: dotenvPath}).parsed || process.env;
    const pkg = require('../package.json');

    const config = {
        env: env.ENV,
        debug: env.DEBUG,
        port: env.PORT || '5000',
        version: pkg.version,
        database: {
            uri: env.DATABASE_URI,
            logging: env.DATABASE_LOGGIN,
        },
        secrets: {
            salt: env.SALT || 'ishu',
        },
    };

    return config;
}
