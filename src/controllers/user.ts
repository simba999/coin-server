import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { authorize } from '../middleware/auth';
import { User } from '../models/user';

const router = express.Router();

router.post('/signup',
    validate({
        body: object().keys({
            first_name: string().required(),
            last_name: string().required(),
            email: string().email().required(),
            phone: string().regex(/^\d{10,11}$/i).required(),
            password: string().min(5).required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        body.email_confirmed = true;
        const user = await User.create(body);

        res.status(201).json(user);
    }),
);

router.post('/login',
    validate({
        body: object().keys({
            email: string().email().required(),
            password: string().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const user = await User.authenticate(body.email, body.password);
        const token = await user.generateToken(user.account);

        res.status(201).json(token);
    }),
);

router.get('/me',
    authorize(),
    errorWrap(async (req: Request, res: Response) => {
        return res.json({
            user: res.locals.user,
        });
    })
);

export default router;
