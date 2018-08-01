import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { PASSWORD_REGEX, User } from '../models/user';
import passport from 'passport';
import { badRequest, methodNotAllowed, notAcceptable, notFound, unauthorized } from 'boom';

const router = express.Router();

router.post('/signup',
    validate({
        body: object().keys({
            firstName: string().required(),
            lastName: string().required(),
            email: string().email().required().lowercase(),
            password: string().min(5).required().regex(PASSWORD_REGEX),
        }).unknown(),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        if (await User.count({
            where: {email: body.email.toLowerCase()},
        })) throw badRequest('User with such email already exists!');

        body.emailConfirmed = true; // temp
        const user = await User.create(body);

        res.status(201).json({
            'status': 'success',
            'data': {
                'message': 'Created user successfully',
                'user': {
                    'firstName': user.firstName,
                    'lastName': user.lastName,
                    'email': user.email,
                    'emailConfirmed': user.emailConfirmed,
                }
            }
        });
    }),
);

router.post('/signin',
    validate({
        body: object().keys({
            email: string().email().required(),
            password: string().required(),
        }).unknown(),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const user: User = await User.findOne({where: {email: body.email}});
        if (!user) throw notFound('User not found!');

        if (!user.emailConfirmed) throw methodNotAllowed('Email is not confirmed. You should confirm email first');
        if (user.password !== User.hashPassword(body.password)) throw unauthorized('Invalid credentials');

        const token = await user.generateToken();

        res.json({
            'status': 'success',
            'data': token
        });
    }),
);

router.put('/user/password',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            password: string().min(5).required().regex(PASSWORD_REGEX),
            currentPassword: string().min(5).required().regex(PASSWORD_REGEX),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const user = req.user;
        if (!user) notFound('User not found');

        if (user.password != User.hashPassword(body.currentPassword))
            res.status(401)
                .json({
                    'status': 'fail',
                    'data': {
                        'message': 'Current password is incorrect'
                    }
                });

        user.password = body.password;
        await user.save();

        res.json({
            'status': 'success',
            'data': {
                'message': 'Changed password successfully',
                'uuid': user.uuid
            }
        });
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
