import { Request, Response } from 'express';
import * as express from 'express';
import { boolean, number, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Security } from '../../models/security';
import { SecurityTransaction } from '../../models/security_transaction';
import { Shareholder } from '../../models/shareholder';
import { notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *     SecurityTransactionInfo:
 *         type: object
 *         required:
 *         - status
 *         - shares
 *         - price
 *         - restricted
 *         - restrictedUntil
 *         - issueDate
 *         - securityId
 *         - shareholderId
 *         properties:
 *             status:
 *                 type: boolean
 *                 example: false
 *             shares:
 *                 type: number
 *                 format: int32
 *                 example: 234.5
 *             price:
 *                 type: number
 *                 format: int32
 *                 example: 10.5
 *             restricted:
 *                 type: boolean
 *                 example: false
 *             restrictUntil:
 *                 type: string
 *                 format: date
 *                 example: 2018/09/25
 *             issueDate:
 *                 type: string
 *                 format: date
 *                 example: 2018/08/01
 *             securityId:
 *                 type: string
 *                 format: uuid
 *                 example: 26716619-b2a2-4f41-a7b3-e80110292c3d
 *             shareholderId:
 *                 type: string
 *                 format: uuid
 *                 example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 */

/**
 * @swagger
 * /security-transaction:
 *     post:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - SecurityTransaction
 *         operationId: createSecurityTransaction
 *         description: Create a security-transaction.
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of security-transaction to create
 *           schema:
 *               $ref: '#/definitions/SecurityTransactionInfo'
 *         responses:
 *             200:
 *                 description: Created security transaction successfully
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
 *                                     example: Created security transaction successfully
 *                                 securitytransaction:
 *                                     type: object
 *                                     required:
 *                                     - status
 *                                     - shares
 *                                     - price
 *                                     - restricted
 *                                     - restrictedUntil
 *                                     - issueDate
 *                                     - securityId
 *                                     - shareholderId
 *                                     properties:
 *                                         status:
 *                                             type: boolean
 *                                             example: false
 *                                         shares:
 *                                             type: number
 *                                             format: int32
 *                                             example: 234.5
 *                                         price:
 *                                             type: number
 *                                             format: int32
 *                                             example: 10.5
 *                                         restricted:
 *                                             type: boolean
 *                                             example: false
 *                                         restrictUntil:
 *                                             type: string
 *                                             format: date
 *                                             example: 2018/09/25
 *                                         issueDate:
 *                                             type: string
 *                                             format: date
 *                                             example: 2018/08/01
 *                                         securityId:
 *                                             type: string
 *                                             format: uuid
 *                                             example: 26716619-b2a2-4f41-a7b3-e80110292c3d
 *                                         shareholderId:
 *                                             type: string
 *                                             format: uuid
 *                                             example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 *             400:
 *                 description: Invalid input, object invalid
 */

router.post('/security-transaction',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            status: boolean(),
            shares: number(),
            price: number(),
            restricted: boolean().required(),
            restrictedUntil: string().max(255),
            issueDate: string().max(255),
            securityId: string().max(255),
            shareholderId: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        if (body.securityId) {
            const security = await Security.findById(body.securityId);
            if (!security) notFound('Security not found');
        }
        if (body.shareholderId) {
            const shareholder = await Shareholder.findById(body.shareholderId);
            if (!shareholder) notFound('Shareholder not found');
        }

        const securityTransaction = await SecurityTransaction.create(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Created security transaction successfully',
                'uuid': securityTransaction.uuid
            }
        });
    }),
);

export default router;
