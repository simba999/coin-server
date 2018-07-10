'use strict';

import * as yargs from 'yargs';
import { Sequelize } from 'sequelize';
import { initSequelize } from './database';
import generateConfig from './config';

const argv = yargs.argv['_'];
const command = argv.shift();
const config = generateConfig();

const commands: any = {
    syncDatabase: async function () {
        console.log('Sync database - started');
        try {
            const sequelize: any = await initSequelize(config);
            await sequelize.sync({force: true, logging: console.log});
            sequelize.close();
        } catch (err) {
            console.error(err);
        }
        console.log('Sync database - ended');
    },

    playground: async function () {
        console.log('Playground - started');

        console.log('Playground - ended');
    },
};

if (command in commands) {
    commands[command]();
} else {
    console.log(`Command "${command}" is not available`);
}

//
