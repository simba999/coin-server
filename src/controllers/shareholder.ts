import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { User } from '../models/user';
import { Shareholder } from '../models/shareholder';
import { notFound } from 'boom';

const router = express.Router();

// create shareholder info
router.post('/shareholder',
    validate({
        body: object().keys({
            userId: string().max(255).required(),
            invitedEmail: string().required().email(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholder = await Shareholder.create(body);

        res.json({
            status: 'success',
            data: shareholder
        });
    }),
);

// update security info
router.put('/shareholder',
    validate({
        body: object().keys({
            shareholderId: string().required(),
            invitedEmail: string().email().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholder = await Shareholder.findById(body.shareholderId);
        if (!shareholder) notFound('Shareholder not found');

        if (body.invitedEmail)
            shareholder.invitedEmail = body.invitedEmail;
        await shareholder.save();

        res.json({
            status: 'success',
            data: shareholder
        });
    }),
);

// get security info
router.get('/shareholder/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const shareholder = await Shareholder.findById(params.uuid);
        if (!shareholder) notFound('Shareholder not found');
        res.json({
            status: 'success',
            data: shareholder
        });
    }),
);

// delete security info
router.delete('/shareholder/:uuid',
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const shareholder = await Shareholder.findById(params.uuid);
        if (!shareholder) notFound('Shareholder not found');
        await shareholder.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
