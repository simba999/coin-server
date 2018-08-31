import { parse as parseUri } from 'url';
import { Sequelize } from 'sequelize-typescript';

import { User } from './models/user';
import { Account } from './models/account';
import { Shareholder } from './models/shareholder';
import { UserAccount } from './models/user_account';
import { Security } from './models/security';
import { SecurityTransaction } from './models/security_transaction';
import { UserToken } from './models/user_token';
import { BillingSubscription } from './models/billing_subscription';
import { BillingPlan } from './models/billing_plan';
import { BillingInvoice } from './models/billing_invoice';
import { BillingTransaction } from './models/billing_transaction';
import { BillingCard } from './models/billing_card';

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
        logging: false,
        underscored: true,
    } as any);

    sequelize.addModels([
        User,
        UserToken,
        Account,
        Shareholder,
        UserAccount,
        Security,
        SecurityTransaction,
        BillingPlan,
        BillingSubscription,
        BillingInvoice,
        BillingTransaction,
        BillingCard,
    ]);

    return sequelize;
}
