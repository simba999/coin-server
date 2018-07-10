import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { PASSWORD_REGEX, User } from '../models/user';
import passport from 'passport';
import { badRequest, methodNotAllowed, notFound, unauthorized } from 'boom';

const router = express.Router();

/**
 * TODO: signup by invite?
 */
router.post('/signup',
    validate({
        body: object().keys({
            firstName: string().required(),
            lastName: string().required(),
            email: string().email().required().lowercase(),
            phone: string().regex(/^\d{10,11}$/i).required(),
            password: string().min(5).required().regex(PASSWORD_REGEX),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        if (await User.count({
            where: {email: body.email.toLowerCase()},
        })) throw badRequest('User with such email already exists!');

        body.emailConfirmed = true; // temp
        const user = await User.create(body);

        res.status(201).json(user);
    }),
);

/**
 *
 */
router.post('/login',
    validate({
        body: object().keys({
            email: string().email().required(),
            password: string().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const user: User = await User.findOne({where: {email: body.email}});
        if (!user) throw notFound('User not found!');

        if (!user.emailConfirmed) throw methodNotAllowed('Email is not confirmed. You should confirm email first');
        if (user.password !== User.hashPassword(body.password)) throw unauthorized('Invalid credentials');

        const token = await user.generateToken();

        res.status(200).json(token);
    }),
);

/**
 *
 */
router.patch('/users/password',
    passport.authenticate('jwt'),
    validate({
        body: object().keys({
            password: string().required().regex(PASSWORD_REGEX),
            passwordConfirm: string().required(),
            currentPassword: string().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        if (body.password !== body.passwordConfirm) badRequest('Passwords doesn\'t match');

        const user = await User.findById(req.params.userId);
        if (!user) notFound('User not found');

        user.password = body.password;
        await user.save();

        res.status(204);
    }),
);

/**
 *
 */
router.get('/me',
    passport.authenticate('jwt', { session: false }),
    errorWrap(async (req: Request, res: Response) => {
        return res.json({user: req.user});
    })
);

export default router;
