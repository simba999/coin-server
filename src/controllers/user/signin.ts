import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { PASSWORD_REGEX, User } from '../../models/user';
import passport from 'passport';
import { badRequest, methodNotAllowed, notAcceptable, notFound, unauthorized } from 'boom';

const router = express.Router();

/**
 * @swagger
 * /signin:
 *     post:
 *         tags:
 *         - Authenticate
 *         operationId: signin
 *         description: Authenticate a user
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of account to create
 *           schema:
 *               type: object
 *               required:
 *               - email
 *               - password
 *               properties:
 *                   email:
 *                       type: string
 *                       format: email
 *                       example: un@yopmail.com
 *                   password:
 *                       type: string
 *                       example: jfieh12393k
 *         responses:
 *             200:
 *                 description: Authenticated user successfully
 *                 schema:
 *                     type: object
 *                     properties:
 *                         status:
 *                             type: string
 *                             example: success
 *                         data:
 *                             type: object
 *                             properties:
 *                                 type:
 *                                     type: string
 *                                     example: Bearer
 *                                 expiresIn:
 *                                     type: number
 *                                     example: 86400
 *                                 accessToken:
 *                                     type: string
 *                                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZGQxMDEwOC05N2I1LTQ2ZGMtOTAyNC0xYjdkYWU4MTBhOWEiLCJpYXQiOjE1MzMwNDIyMTIsImV4cCI6MTUzMzEyODYxMn0.Y9LuZ4gpsCQLJ0WScBHQuciMlGzMn8qU6Umf_ZZGLYY
 *             400:
 *                 description: Invalid input, object invalid
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

        const user: User = await User.findOne({where: {email: body.email.toLowerCase()}});
        if (!user) throw notFound('User not found!');

        if (!user.emailConfirmed) throw methodNotAllowed('Email is not confirmed. You should confirm email first');
        if (user.password !== User.hashPassword(body.password)) throw unauthorized('Invalid credentials');

        const token = await user.generateToken();

        res.status(200)
            .json({
            'status': 'success',
            'data': token
        });
    }),
);

export default router;
