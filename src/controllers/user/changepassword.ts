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
 * /user/password:
 *     put:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Authenticate
 *         operationId: changePassword
 *         description: Change password of authenticated user
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of password info to update
 *           schema:
 *               type: object
 *               required:
 *               - password
 *               - currentPassword
 *               properties:
 *                   password:
 *                       type: string
 *                       example: Dfieh@2393k
 *                   currentPassword:
 *                       type: string
 *                       example: Kugnb$352ft
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
 *                                 message:
 *                                     type: string
 *                                     example: Changed password successfully
 *                                 uuid:
 *                                     type: string
 *                                     format: uuid
 *                                     example: 9dd10108-97b5-46dc-9024-1b7dae810a9a
 *             401:
 *                 description: 'Invalid input, object invalid'
 *                 schema:
 *                     type: object
 *                     properties:
 *                         status:
 *                             type: string
 *                             example: fail
 *                         data:
 *                             type: object
 *                             properties:
 *                                 message:
 *                                     type: string
 *                                     example: Current password is incorrect
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

export default router;
