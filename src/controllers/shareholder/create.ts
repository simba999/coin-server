import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Shareholder } from '../../models/shareholder';
import passport from 'passport';

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
 *             userId:
 *                 type: string
 *                 format: uuid
 *                 example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 *             inviteToken:
 *                 type: string
 *                 example: 6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
 */

/**
 * @swagger
 * /shareholder:
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

router.post('/shareholder',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            name: string().max(255).required(),
            type: string().valid(['individual', 'non-individual']),
            invitedEmail: string().required().email(),
            address: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholder = await Shareholder.create(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Created shareholder successfully',
                shareholder
            }
        });
    }),
);

export default router;
