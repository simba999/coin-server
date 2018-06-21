import { parse as parseUri } from 'url';
import { Sequelize } from 'sequelize-typescript';

import { User } from './models/user';
import { Company } from './models/company';
import { UserCompany } from './models/user_company';

export async function initSequelize(config: any) {
    const uriParts = parseUri(config.database.uri);
    const dbAuth: any = {};

    [dbAuth.username, dbAuth.password] = uriParts.auth.split(':');

    const sequelize = new Sequelize({
        dialect: uriParts.protocol.replace(':', ''),
        database: uriParts.path.replace('/', ''),
        username: dbAuth.username,
        password: dbAuth.password,
        operatorsAliases: false,
    } as any);

    sequelize.addModels([
        User,
        Company,
        UserCompany,
    ]);

    // await sequelize.sync({ force: true,
    //     logging: true,
    // });

    return sequelize;
}

export function syncDatabase() {
    console.log('sync');

    return 'test';
}