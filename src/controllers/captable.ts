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
        const account = await Account.create(body);
        await account.updateAttributes({'name': body.companyName, 'type': 'company'});

        // create securities
        for (const obj of body.securities) {
            const security = await Security.create(obj);
            await security.updateAttributes({'accountId': account.uuid});
        }

        // create shareholders
        for (const obj of body.shareholders) {
            const shareholder = await Shareholder.create(obj);

            await ShareholderAccount.create({
                'shareholderId': shareholder.uuid,
                'accountId': account.uuid,
                'role': 'employee',
            });
        }

        res.json({
            'status': 'success',
            'data': {
                'message': 'Created successfully'
            }
        });
    }),
);

export default router;
