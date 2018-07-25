import { Request, Response } from 'express';
import * as express from 'express';
import { number, object, string } from 'joi';
import { Sequelize } from 'sequelize-typescript';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { Security } from '../models/security';
import { SecurityTransaction } from '../models/security_transaction';
import { Shareholder } from '../models/shareholder';
import { ShareholderAccount } from '../models/shareholder_account';
import { notFound } from 'boom';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.post('/security',
    validate({
        body: object().keys({
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            underlyingSecurity: string().max(255),
            accountId: string().required(),
            securityClass: string().max(255).required(),
            authorized: number(),
            issued: number(),
            tokenized: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.findById(body.accountId);
        if (!account) notFound('Account not found');

        if (typeof body.underlyingSecurity == 'undefined')
            body.underlyingSecurity = uuid();
        const security = await Security.create(body);

        res.json({
            status: 'success',
            data: security
        });
    }),
);

router.get('/captable',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        res.status(200);
    }),
);

router.get('/captable/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        res.status(200);
    }),
);

export default router;
