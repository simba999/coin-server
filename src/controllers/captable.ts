import { Request, Response } from 'express';
import * as express from 'express';
import { array, number, object, required, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { Security } from '../models/security';
import { SecurityTransaction } from '../models/security_transaction';
import { Shareholder } from '../models/shareholder';
import { ShareholderAccount } from '../models/shareholder_account';

const router = express.Router();

router.post('/initialize',
    validate({
        body: object().keys({
            companyName: string().required().max(255),
            incDate: string().required(),
            website: string().required(),
            currency: string().required(),
            country: string().required(),
            state: string().required(),
            funding: string().required().valid(['Not Raised Any Money', 'Raised Via Notes Only', 'Seed Stage', 'Series A or Later']),
            role: string().required().valid(['owner', 'employee', 'shareholder']),
            securities: array().required(),
            shareholders: array().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        // Create Account with company type
        const account = new Account();
        account.type = 'company';
        account.name = body.companyName;
        account.country = body.country;
        account.state = body.state;
        account.incDate = body.incDate;
        account.website = body.website;
        account.currency = body.currency;
        account.funding = body.funding;
        await account.save();

        for (const obj of body.securities) {
            const security = new Security();
            security.name = obj.name;
            security.type = obj.type;
            security.authorized = obj.authorized;
            security.liquidation = obj.liquidation;
            security.accountId = account.uuid;

            await security.save();
        }

        for (const obj of body.shareholders) {
            const shareholder = new Shareholder();
            shareholder.name = obj.name;
            shareholder.type = obj.type;
            shareholder.invitedEmail = obj.invitedEmail;
            shareholder.address = obj.address;

            await shareholder.save();
        }

        res.json(account);
    }),
);

export default router;
