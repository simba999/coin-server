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
import passport from 'passport';

const router = express.Router();

router.post('/initialize',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            name: string().required().max(255),
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
        body.type = 'company';
        const account = await Account.create(body);

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
                'message': 'Created captable data successfully'
            }
        });
    }),
);

export default router;
