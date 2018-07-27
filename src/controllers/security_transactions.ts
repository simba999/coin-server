import { Request, Response } from 'express';
import * as express from 'express';
import { boolean, number, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Security } from '../models/security';
import { SecurityTransaction } from '../models/security_transaction';
import { Shareholder } from '../models/shareholder';
import { notFound } from 'boom';

const router = express.Router();

// create security transaction info
router.post('/security-transaction',
    validate({
        body: object().keys({
            status: boolean(),
            shares: number(),
            price: number(),
            restricted: boolean().required(),
            restrictedUntil: string().max(255),
            issueDate: string().max(255),
            securityId: string().max(255),
            shareholderId: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        if (body.securityId) {
            const security = await Security.findById(body.securityId);
            if (!security) notFound('Security not found');
        }
        if (body.shareholderId) {
            const shareholder = await Shareholder.findById(body.shareholderId);
            if (!shareholder) notFound('Shareholder not found');
        }

        const securityTransaction = await SecurityTransaction.create(body);

        res.json({
            status: 'success',
            data: securityTransaction
        });
    }),
);

// update security transaction info
router.put('/security-transaction',
    validate({
        body: object().keys({
            securityTransactionId: string().required(),
            status: boolean(),
            shares: number(),
            price: number(),
            restricted: boolean(),
            restrictedUntil: string().max(255),
            issueDate: string().max(255),
            securityId: string().max(255),
            shareholderId: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const securityTransaction = await SecurityTransaction.findById(body.securityTransactionId);
        if (!securityTransaction) notFound('SecurityTransaction not found');

        if (body.status)
            securityTransaction.status = body.status;
        if (body.shares)
            securityTransaction.shares = body.shares;
        if (body.price)
            securityTransaction.price = body.price;
        if (body.restricted)
            securityTransaction.restricted = body.restricted;
        if (body.restrictedUntil)
            securityTransaction.restrictedUntil = body.restrictedUntil;
        if (body.issueDate)
            securityTransaction.issueDate = body.issueDate;
        if (body.securityId)
            securityTransaction.securityId = body.securityId;
        if (body.shareholderId)
            securityTransaction.shareholderId = body.shareholderId;
        await securityTransaction.save();

        res.json({
            status: 'success',
            data: securityTransaction
        });
    }),
);

// get security info
router.get('/security-transaction/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const securityTransaction = await SecurityTransaction.findById(params.uuid);
        if (!securityTransaction) notFound('SecurityTransaction not found');

        res.json({
            status: 'success',
            data: securityTransaction
        });
    }),
);

// delete security info
router.delete('/security-transaction/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const securityTransaction = await SecurityTransaction.findById(params.uuid);
        if (!securityTransaction) notFound('SecurityTransaction not found');
        await securityTransaction.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
