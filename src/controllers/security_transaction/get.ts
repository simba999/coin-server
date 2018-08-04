import { Request, Response } from 'express';
import * as express from 'express';
import { boolean, number, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Security } from '../../models/security';
import { SecurityTransaction } from '../../models/security_transaction';
import { Shareholder } from '../../models/shareholder';
import { badData } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /security-transaction/{uuid}:
 *     get:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - SecurityTransaction
 *         operationId: getSecurityTransaction
 *         description: |
 *             Get the security transaction information
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass search uuid for an unique security transaction
 *         responses:
 *             200:
 *                 description: Get security transaction information successfully
 *                 schema:
 *                     $ref: '#/definitions/SecurityTransactionInfo'
 *             400:
 *                 description: Bad input parameter
 */

router.get('/security-transaction/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const securityTransaction = await SecurityTransaction.findById(params.uuid);
        if (!securityTransaction) throw badData('SecurityTransaction not found');

        res.json({
            status: 'success',
            data: securityTransaction
        });
    }),
);

export default router;
