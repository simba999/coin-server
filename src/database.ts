import { parse as parseUri } from 'url';
import { Sequelize } from 'sequelize-typescript';

import { User } from './models/user';
import { Account } from './models/account';
import { Shareholder } from './models/shareholder';
import { ShareholderAccount } from './models/shareholder_account';
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

    const sequelize = new Sequelize(config.database.uri);

    sequelize.addModels([
        User,
        UserToken,
        Account,
        Shareholder,
        ShareholderAccount,
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
