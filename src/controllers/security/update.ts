import { Request, Response } from 'express';
import * as express from 'express';
import { number, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Account } from '../../models/account';
import { Security } from '../../models/security';
import { notFound } from 'boom';
import { v4 as uuid } from 'uuid';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /security:
 *     put:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Security
 *         operationId: updateSecurity
 *         description: Update a security information.
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of account to update
 *           schema:
 *               type: object
 *               required:
 *               - securityId
 *               properties:
 *                   securityId:
 *                       type: string
 *                       format: uuid
 *                       example: ddfa7024-812e-4f1f-92be-ab167010549b
 *                   type:
 *                       type: string
 *                       enum: [warrant, preferred_stock, common_stock', option]
 *                       example: preferred_stock
 *                   name:
 *                       type: string
 *                       example: Security 1
 *                   authorized:
 *                       type: number
 *                       example: 21
 *                   liquidation:
 *                       type: string
 *                       example: liquidation 1
 *                   accountId:
 *                       type: string
 *                       format: uuid
 *                       example: 5172e1e8-7c0e-47ee-9fe1-082c619de99f
 *         responses:
 *             200:
 *                 description: Updated security successfully
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
 *                                     example: Updated security successfully
 *                                 uuid:
 *                                     type: string
 *                                     format: uuid
 *                                     example: ddfa7024-812e-4f1f-92be-ab167010549b
 *             400:
 *                 description: Invalid input, object invalid
 */

router.put('/security',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            securityId: string().required(),
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            authorized: number(),
            liquidation: string().max(255),
            accountId: string(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const security = await Security.findById(body.securityId);
        if (!security) notFound('Security not found');

        if (body.accountId) {
            const account = await Account.findById(body.accountId);
            if (!account) notFound('Account not found');
        }

        await security.update(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Updated security successfully',
                'uuid': security.uuid
            }
        });
    }),
);

export default router;
