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
 * definitions:
 *     UserInfo:
 *         type: object
 *         required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         properties:
 *             firstName:
 *                 type: string
 *                 example: FName
 *             lastName:
 *                 type: string
 *                 example: LName
 *             email:
 *                 type: string
 *                 format: email
 *                 example: un@yopmail.com
 *             password:
 *                 type: string
 *                 example: Djfhe837$je
 */

/**
 * @swagger
 * /signup:
 *     post:
 *         tags:
 *         - Authenticate
 *         operationId: signup
 *         description: Create a user
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
 *               $ref: '#/definitions/UserInfo'
 *         responses:
 *             200:
 *                 description: Created user successfully
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
 *                                     example: Created user successfully
 *                                 user:
 *                                     type: object
 *                                     required:
 *                                     - firstName
 *                                     - lastName
 *                                     - email
 *                                     - password
 *                                     properties:
 *                                         firstName:
 *                                             type: string
 *                                             example: FName
 *                                         lastName:
 *                                             type: string
 *                                             example: LName
 *                                         email:
 *                                             type: string
 *                                             format: email
 *                                             example: un@yopmail.com
 *                                         emailConfirmed:
 *                                             type: boolean
 *                                             example: false
 *             400:
 *                 description: Invalid input, object invalid
 */

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

export default router;
