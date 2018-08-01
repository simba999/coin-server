import { Request, Response } from 'express';
import * as express from 'express';
import { boolean, number, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Security } from '../models/security';
import { SecurityTransaction } from '../models/security_transaction';
import { Shareholder } from '../models/shareholder';
import { notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

router.post('/security-transaction',
    passport.authenticate('jwt', { session: false }),
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
            data: {
                'message': 'Created security transaction successfully',
                'uuid': securityTransaction.uuid
            }
        });
    }),
);

router.put('/security-transaction',
    passport.authenticate('jwt', { session: false }),
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

        await securityTransaction.update(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Updated security transaction successfully',
                'uuid': securityTransaction.uuid
            }
        });
    }),
);

router.get('/security-transaction/:uuid',
    passport.authenticate('jwt', { session: false }),
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

router.delete('/security-transaction/:uuid',
    passport.authenticate('jwt', { session: false }),
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
