import { Request, Response } from 'express';
import * as express from 'express';
import { date, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { badRequest, notFound } from 'boom';

const router = express.Router();

// create company
router.post('/accounts',
    validate({
        body: object().keys({
            type: string().valid(['company']).required(),
            name: string().max(255).required(),
            incDate: date().required(),
            website: string(),
            currency: string().max(255),
            country: string().max(255).required(),
            state: string().max(255).required(),
            funding: string().valid(['Not Raised Any Money', 'Raised Via Notes Only', 'Seed Stage', 'Series A or Later']).required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.create(body);
        res.json({
            status: 'success',
            data: account
        });
    }),
);

// update company info
router.put('/accounts',
    validate({
        body: object().keys({
            accountId: string().required(),
            type: string().valid(['company']).required(),
            name: string().max(255).required(),
            incDate: date().required(),
            website: string(),
            currency: string().max(255),
            country: string().max(255).required(),
            state: string().max(255).required(),
            funding: string().valid(['Not Raised Any Money', 'Raised Via Notes Only', 'Seed Stage', 'Series A or Later']).required()
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.findById(body.accountId);
        if (!account) notFound('Account not found');

        await account.update(body);

        res.json({
            status: 'success',
            data: account
        });
    }),
);

// get specific company
router.get('/accounts/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const account = await Account.findById(params.uuid);
        if (!account) notFound('Account not found');
        res.json({
            status: 'success',
            data: account
        });
    }),
);

// delete specific company
router.delete('/accounts/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const account = await Account.findById(params.uuid);
        if (!account) notFound('Account not found');
        await account.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
