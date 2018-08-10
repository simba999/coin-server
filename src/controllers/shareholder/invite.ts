import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap, sendInvitationMail } from '../../utils';
import validate from '../../middleware/validate';
import { Shareholder } from '../../models/shareholder';
import passport from 'passport';
import crypto from 'crypto';
import { badData, badRequest } from 'boom';

const router = express.Router();

/**
 * @swagger
 * /shareholder/invite:
 *     post:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Shareholder
 *         operationId: inviteShareholder
 *         description: Invite a shareholder to Ishu.
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of shareholder to create
 *           schema:
 *               type: object
 *               required:
 *               - shareholderId
 *               properties:
 *                   shareholderId:
 *                       type: string
 *                       format: uuid
 *                       example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 *                   invitedEmail:
 *                       type: string
 *                       format: email
 *                       example: shareholder@yopmail.com
 *         responses:
 *             200:
 *                 description: Created shareholder successfully
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
 *                                     example: Invited shareholder successfully
 *                                 inviteToken:
 *                                     type: string
 *                                     example: 6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
 *             400:
 *                 description: Invalid input, object invalid
 */

router.post('/shareholder/invite',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            shareholderId: string().required().uuid(),
            invitedEmail: string().required().email(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholder = await Shareholder.findById(body.shareholderId);
        if (!shareholder) throw badData('Shareholder not found');

        if (shareholder.inviteToken != null)
            throw badData('Shareholder is already invited to Ishu');

        const hash = crypto.createHash('sha256');
        hash.update(new Date().toISOString() + body.invitedEmail + 'ISHU');
        const token = hash.digest('hex');

        await shareholder.update({
            inviteToken: token,
            invitedEmail: body.invitedEmail
        });

        sendInvitationMail(
            body.invitedEmail,
            'Hello, You\'re invited to ISHU! Your invite link is ' +
                process.env.URL + '/shareholder/invite-accept/' + token +
                ' Thanks.'
        );

        res.json({
            status: 'success',
            data: {
                message: 'Invited shareholder successfully',
                inviteToken: token
            }
        });
    }),
);

export default router;
