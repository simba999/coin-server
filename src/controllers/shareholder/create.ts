import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { User } from '../../models/user';
import { Shareholder } from '../../models/shareholder';
import { notFound } from 'boom';
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
 *                                     example: Created shareholder successfully
 *                                 shareholder:
 *                                     type: object
 *                                     required:
 *                                     - name
 *                                     - type
 *                                     - invitedEmail
 *                                     - address
 *                                     properties:
 *                                         name:
 *                                             type: string
 *                                             example: Shareholder 1
 *                                         type:
 *                                             type: string
 *                                             enum: [individual, non-individual]
 *                                             example: individual
 *                                         invitedEmail:
 *                                             type: string
 *                                             format: email
 *                                             example: shareholder@yopmail.com
 *                                         address:
 *                                             type: string
 *                                             example: new york, united state
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
                'shareholder': {
                    'name': shareholder.name,
                    'type': shareholder.type,
                    'invitedEmail': shareholder.invitedEmail,
                    'address': shareholder.address,
                }
            }
        });
    }),
);

export default router;
