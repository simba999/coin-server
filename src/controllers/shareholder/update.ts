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
 * /shareholder:
 *     put:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Shareholder
 *         operationId: updateShareholder
 *         description: Update a shareholder information.
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of shareholder to update
 *           schema:
 *               type: object
 *               required:
 *               - shareholderId
 *               properties:
 *                   shareholderId:
 *                       type: string
 *                       format: uuid
 *                       example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 *                   name:
 *                       type: string
 *                       example: Shareholder 1
 *                   type:
 *                       type: string
 *                       enum: [individual, non-individual]
 *                       example: individual
 *                   invitedEmail:
 *                       type: string
 *                       format: email
 *                       example: shareholder@yopmail.com
 *                   address:
 *                       type: string
 *                       example: new york, united state
 *         responses:
 *             200:
 *                 description: Updated shareholder information successfully
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
 *                                     example: Updated shareholder successfully
 *                                 uuid:
 *                                     type: string
 *                                     format: uuid
 *                                     example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 *             400:
 *                 description: Invalid input, object invalid
 */

router.put('/shareholder',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            shareholderId: string().required(),
            name: string().max(255),
            type: string().valid(['individual', 'non-individual']),
            invitedEmail: string().email(),
            address: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholder = await Shareholder.findById(body.shareholderId);
        if (!shareholder) notFound('Shareholder not found');

        await shareholder.update(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Updated shareholder successfully',
                'uuid': shareholder.uuid
            }
        });
    }),
);

export default router;
