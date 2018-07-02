import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new (winston.transports.Console)({level: 'error'}),
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}

export default logger;

