import { Request, Response } from 'express';
import * as express from 'express';
import { number, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { Security } from '../models/security';
import { notFound } from 'boom';
import { v4 as uuid } from 'uuid';

const router = express.Router();

// create security info
router.post('/security',
    validate({
        body: object().keys({
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            underlyingSecurity: string().max(255),
            accountId: string().required(),
            securityClass: string().max(255),
            authorized: number(),
            issued: number(),
            tokenized: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.findById(body.accountId);
        if (!account) notFound('Account not found');

        if (!body.underlyingSecurity)
            body.underlyingSecurity = uuid();
        const security = await Security.create(body);

        res.json({
            status: 'success',
            data: security
        });
    }),
);

// update security info
router.put('/security',
    validate({
        body: object().keys({
            securityId: string().required(),
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            accountId: string().max(255),
            authorized: number(),
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

        if (body.type)
            security.type = body.type;
        if (body.name)
            security.name = body.name;
        if (body.accountId)
            security.accountId = body.accountId;
        if (body.authorized)
            security.authorized = body.authorized;
        await security.save();

        res.json({
            status: 'success',
            data: security
        });
    }),
);

// get security info
router.get('/security/:uuid',
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

// delete security info
router.delete('/security/:uuid',
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
