import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Security } from '../models/security';
import { Shareholder } from '../models/shareholder';
import { ShareholderAccount } from '../models/shareholder_account';
import { notFound } from 'boom';
import { Account } from '../models/account';

const router = express.Router();

// create shareholder account info
router.post('/shareholder-account',
    validate({
        body: object().keys({
            shareholderId: string().max(255).required(),
            accountId: string().max(255).required(),
            role: string().valid(['owner', 'employee', 'shareholder']).required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholder = await Security.findById(body.shareholderId);
        if (!shareholder) notFound('Shareholder not found');

        const accountId = await Account.findById(body.accountId);
        if (!accountId) notFound('Account not found');

        const shareholder_account = await ShareholderAccount.create(body);

        res.json({
            status: 'success',
            data: shareholder_account
        });
    }),
);

// update security transaction info
router.put('/shareholder-account',
    validate({
        body: object().keys({
            shareholderAccountId: string().max(255).required(),
            shareholderId: string().max(255),
            accountId: string().max(255),
            role: string().valid(['owner', 'employee', 'shareholder']),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholderAccount = await ShareholderAccount.findById(body.shareholderAccountId);
        if (!shareholderAccount) notFound('ShareholderAccount not found');

        if (body.shareholderId) {
            const shareholder = await Shareholder.findById(body.shareholderId);
            if (!shareholder) notFound('Shareholder not found');
            shareholderAccount.shareholderId = body.shareholderId;
        }
        if (body.accountId) {
            const account = await Account.findById(body.accountId);
            if (!account) notFound('Account not found');
            shareholderAccount.accountId = body.accountId;
        }
        if (body.role)
            shareholderAccount.role = body.role;
        await shareholderAccount.save();

        res.json({
            status: 'success',
            data: shareholderAccount
        });
    }),
);

// get security info
router.get('/shareholder-account/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const shareholderAccount = await ShareholderAccount.findById(params.uuid);
        if (!shareholderAccount) notFound('ShareholderAccount not found');

        res.json({
            status: 'success',
            data: shareholderAccount
        });
    }),
);

// delete security info
router.delete('/shareholder-account/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const shareholderAccount = await ShareholderAccount.findById(params.uuid);
        if (!shareholderAccount) notFound('ShareholderAccount not found');
        await shareholderAccount.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
