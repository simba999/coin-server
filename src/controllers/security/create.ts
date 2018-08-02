import { Request, Response } from 'express';
import * as express from 'express';
import { number, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Account } from '../../models/account';
import { Security } from '../../models/security';
import { notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *     SecurityInfo:
 *         type: object
 *         required:
 *         - type
 *         - name
 *         - authorized
 *         - liquidation
 *         - accountId
 *         properties:
 *             type:
 *                 type: string
 *                 enum: [warrant, preferred_stock, common_stock', option]
 *                 example: preferred_stock
 *             name:
 *                 type: string
 *                 example: Security 1
 *             authorized:
 *                 type: number
 *                 example: 21
 *             liquidation:
 *                 type: string
 *                 example: liquidation 1
 *             accountId:
 *                 type: string
 *                 format: uuid
 *                 example: 5172e1e8-7c0e-47ee-9fe1-082c619de99f
 */

/**
 * @swagger
 * /security:
 *     post:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Security
 *         operationId: createSecurity
 *         description: Create a security.
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of security to create
 *           schema:
 *               $ref: '#/definitions/SecurityInfo'
 *         responses:
 *             200:
 *                 description: Created security successfully
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
 *                                     example: Created security successfully
 *                                 security:
 *                                     type: object
 *                                     properties:
 *                                         type:
 *                                             type: string
 *                                             enum: [warrant, preferred_stock, common_stock', option]
 *                                             example: preferred_stock
 *                                         name:
 *                                             type: string
 *                                             example: Security 1
 *                                         authorized:
 *                                             type: number
 *                                             example: 21
 *                                         liquidation:
 *                                             type: string
 *                                             example: liquidation 1
 *                                         accountId:
 *                                             type: string
 *                                             format: uuid
 *                                             example: 5172e1e8-7c0e-47ee-9fe1-082c619de99f
 *             400:
 *                 description: Invalid input, object invalid
 */

router.post('/security',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            authorized: number(),
            liquidation: string().max(255),
            accountId: string().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.findById(body.accountId);
        if (!account) notFound('Account not found');

        const security = await Security.create(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Created security successfully',
                'security': {
                    'name': security.name,
                    'type': security.type,
                    'authorized': security.authorized,
                    'liquidation': security.liquidation,
                    'accountId': security.accountId
                }
            }
        });
    }),
);

export default router;
