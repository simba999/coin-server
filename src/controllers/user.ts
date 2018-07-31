import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { PASSWORD_REGEX, User } from '../models/user';
import passport from 'passport';
import { badRequest, methodNotAllowed, notAcceptable, notFound, unauthorized } from 'boom';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *  UserInfo:
 *   type: object
 *   required:
 *   - firstName
 *   - lastName
 *   - email
 *   - phone
 *   - password
 *   properties:
 *     firstName:
 *       type: string
 *       example: FName
 *     lastName:
 *       type: string
 *       example: LName
 *     email:
 *       type: string
 *       format: email
 *       example: un@yopmail.com
 *     phone:
 *       type: string
 *       example: "2790983039"
 *     password:
 *       type: string
 *       example: Djfhe837$je
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *     - Authenticate
 *     operationId: signup
 *     description: Create a user
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: json_data
 *       description: |
 *         Json Data of account to create
 *       schema:
 *         $ref: '#/definitions/UserInfo'
 *     responses:
 *       200:
 *         description: Created user successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             data:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Created user successfully
 *       400:
 *         description: Invalid input, object invalid
 */
router.post('/signup',
    validate({
        body: object().keys({
            firstName: string().required(),
            lastName: string().required(),
            email: string().email().required().lowercase(),
            phone: string().regex(/^\d{10,11}$/i).required(),
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
                'message': 'Created user successfully'
            }
        });
    }),
);

/**
 * @swagger
 * /signin:
 *   post:
 *     tags:
 *     - Authenticate
 *     operationId: signin
 *     description: Authenticate a user
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: json_data
 *       description: |
 *         Json Data of account to create
 *       schema:
 *         type: object
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             format: email
 *             example: un@yopmail.com
 *           password:
 *             type: string
 *             example: Djfhe837$je
 *     responses:
 *       200:
 *         description: Authenticated user successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             data:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: Bearer
 *                 expiresIn:
 *                   type: number
 *                   example: 86400
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZGQxMDEwOC05N2I1LTQ2ZGMtOTAyNC0xYjdkYWU4MTBhOWEiLCJpYXQiOjE1MzMwNDIyMTIsImV4cCI6MTUzMzEyODYxMn0.Y9LuZ4gpsCQLJ0WScBHQuciMlGzMn8qU6Umf_ZZGLYY
 *       400:
 *         description: Invalid input, object invalid
 */
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

/**
 * @swagger
 *   /user/password:
 *     put:
 *       security:
 *         - Bearer: []
 *       tags:
 *         - Authenticate
 *       operationId: changePassword
 *       description: Change password of authenticated user
 *       parameters:
 *       - in: body
 *         name: json_data
 *         description: |
 *           Json Data of password info to update
 *         schema:
 *           type: object
 *           required:
 *             - password
 *             - currentPassword
 *           properties:
 *             password:
 *               type: string
 *               example: Jfieh!2393k
 *             currentPassword:
 *               type: string
 *               example: Kugnb$352ft
 *       responses:
 *         200:
 *           description: Authenticated user successfully
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *               data:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Changed password successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: 9dd10108-97b5-46dc-9024-1b7dae810a9a
 *         401:
 *           description: 'Invalid input, object invalid'
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: fail
 *               data:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Current password is incorrect
 */
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
