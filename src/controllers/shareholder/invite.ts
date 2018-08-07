import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap, sendInvitationMail } from '../../utils';
import validate from '../../middleware/validate';
import { Shareholder } from '../../models/shareholder';
import passport from 'passport';
import NodeMailer from 'nodemailer';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *     ShareholderInfo:
 *         type: object
 *         required:
 *         - name
 *         - type
 *         - invitedEmail
 *         - address
 *         properties:
 *             name:
 *                 type: string
 *                 example: Shareholder 1
 *             type:
 *                 type: string
 *                 enum: [individual, non-individual]
 *                 example: individual
 *             invitedEmail:
 *                 type: string
 *                 format: email
 *                 example: shareholder@yopmail.com
 *             address:
 *                 type: string
 *                 example: new york, united state
 */

/**
 * @swagger
 * /shareholder/invite:
 *     post:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Shareholder
 *         operationId: createShareholder
 *         description: Create a shareholder.
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
 *               $ref: '#/definitions/ShareholderInfo'
 *         responses:
 *             200:
 *                 description: Created shareholder successfully
 *                 schema:
 *                     $ref: '#/definitions/ShareholderInfo'
 *             400:
 *                 description: Invalid input, object invalid
 */

router.post('/shareholder/invite',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            invitedEmail: string().required().email(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        sendInvitationMail(body.invitedEmail);
    }),
);

export default router;
