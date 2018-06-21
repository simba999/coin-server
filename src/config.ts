import dotenv from 'dotenv';

export default function generateConfig(dotenvPath = '.env') {
    const env = dotenv.config({ path: dotenvPath }).parsed || process.env;
    const pkg = require('../package.json');

    return {
        env: env.ENV,
        debug: env.DEBUG,
        version: pkg.version,
        database: {
            uri: 'mysql://root:0123456789@localhost/ishu_local'
        }
    };
}
