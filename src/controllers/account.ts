import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { authorize } from '../middleware/auth';
import { User } from '../models/user';

const router = express.Router();

router.post('/accounts',
    validate({
        body: object().keys({
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        res.status(200);
    }),
);

router.get('/accounts',
    validate({
        body: object().keys({
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        res.status(200);
    }),
);

router.get('/accounts/:uuid',
    validate({
        body: object().keys({
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        res.status(200);
    }),
);

router.patch('/accounts/:uuid',
    validate({
        body: object().keys({
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        res.status(200);
    }),
);

export default router;
