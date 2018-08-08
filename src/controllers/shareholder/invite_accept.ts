import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap, sendInvitationMail } from '../../utils';
import validate from '../../middleware/validate';
import { Shareholder } from '../../models/shareholder';
import passport from 'passport';
import crypto from 'crypto';
import { badData, badRequest } from 'boom';
import { PASSWORD_REGEX, User } from '../../models/user';

const router = express.Router();

/**
 * @swagger
 * /shareholder/invite-accept/{token}:
 *     post:
 *         tags:
 *         - Shareholder
 *         operationId: inviteAcceptShareholder
 *         description: Accept shareholder invitation for register user
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: token
 *           type: string
 *           required: true
 *           description: Pass invitation token for an unique shareholder
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of user info to register
 *           schema:
 *               type: object
 *               required:
 *               - password
 *               properties:
 *                   firstName:
 *                       type: string
 *                       example: FName
 *                   lastName:
 *                       type: string
 *                       example: LName
 *                   password:
 *                       type: string
 *                       example: Djfhe837$je
 *         responses:
 *             200:
 *                 description: Accepted shareholder invitation for register user successfully
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
 *                                     example: Accepted shareholder invitation successfully
 *                                 user:
 *                                     type: object
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
 *                                 shareholder:
 *                                     $ref: '#/definitions/ShareholderInfo'
 *             400:
 *                 description: Invalid input, object invalid
 */

router.post('/shareholder/invite-accept/:token',
    validate({
        body: object().keys({
            firstName: string().required(),
            lastName: string().required(),
            password: string().min(5).required().regex(PASSWORD_REGEX),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;
        const params = req.params;

        const shareholder = await Shareholder.find({
            where: {
                inviteToken: params.token
            }
        });
        if (!shareholder) throw badData('Shareholder not found');

        body.email = shareholder.invitedEmail;
        if (await User.count({
            where: {email: body.email.toLowerCase()},
        })) throw badRequest('User with such email already exists!');

        body.emailConfirmed = true;
        const user = await User.create(body);

        await shareholder.update({
            inviteToken: 'Invited',
            userId: user.uuid
        });

        res.json({
            status: 'success',
            data: {
                message: 'Accepted shareholder invitation successfully',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    emailConfirmed: user.emailConfirmed
                },
                shareholder
            }
        });
    }),
);

export default router;
