import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { badRequest, notFound } from 'boom';

const router = express.Router();

// create company
router.post('/accounts',
    validate({
        body: object().keys({
            type: string().valid(['company']),
            name: string().max(255),
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
            type: string().valid(['company']),
            name: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.findById(body.accountId);
        if (!account) notFound('Account not found');

        if (body.type)
            account.type = body.type;
        if (body.name)
            account.name = body.name;
        await account.save();

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
