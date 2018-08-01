import { Request, Response } from 'express';
import * as express from 'express';
import { number, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { Security } from '../models/security';
import { notFound } from 'boom';
import { v4 as uuid } from 'uuid';
import passport from 'passport';

const router = express.Router();

router.post('/security',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            authorized: number(),
            liquidation: string().max(255),
            accountId: string().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.findById(body.accountId);
        if (!account) notFound('Account not found');

        const security = await Security.create(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Created security successfully',
                'security': {
                    'name': security.name,
                    'type': security.type,
                    'authorized': security.authorized,
                    'liquidation': security.liquidation,
                    'accountId': security.accountId
                }
            }
        });
    }),
);

router.put('/security',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            securityId: string().required(),
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            authorized: number(),
            liquidation: string().max(255),
            accountId: string(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const security = await Security.findById(body.securityId);
        if (!security) notFound('Security not found');

        if (body.accountId) {
            const account = await Account.findById(body.accountId);
            if (!account) notFound('Account not found');
        }

        await security.update(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Updated security successfully',
                'uuid': security.uuid
            }
        });
    }),
);

router.get('/security/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const security = await Security.findById(params.uuid);
        if (!security) notFound('Security not found');
        res.json({
            status: 'success',
            data: security
        });
    }),
);

router.delete('/security/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const security = await Security.findById(params.uuid);
        if (!security) notFound('Security not found');
        await security.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
