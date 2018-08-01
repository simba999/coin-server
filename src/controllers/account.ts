import { Request, Response } from 'express';
import * as express from 'express';
import { date, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { badRequest, notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

router.post('/account',
    passport.authenticate('jwt', { session: false }),
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
            data: {
                'message': 'Created account successfully',
                'account': {
                    'type': account.type,
                    'name': account.name,
                    'incDate': account.incDate,
                    'website': account.website,
                    'currency': account.currency,
                    'country': account.country,
                    'state': account.state,
                    'funding': account.funding
                }
            }
        });
    }),
);

router.put('/account',
    passport.authenticate('jwt', { session: false }),
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
            data: {
                'message': 'Updated account successfully',
                'uuid': account.uuid
            }
        });
    }),
);

router.get('/account/:uuid',
    passport.authenticate('jwt', { session: false }),
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

router.delete('/account/:uuid',
    passport.authenticate('jwt', { session: false }),
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
