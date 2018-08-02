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
 * /security-transaction/{uuid}:
 *     delete:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - SecurityTransaction
 *         operationId: deleteSecurityTransaction
 *         description: |
 *             Delete the security transaction information
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass delete uuid for an unique security transaction
 *         responses:
 *             200:
 *                 description: Deleted security transaction information successfully
 *                 schema:
 *                     type: object
 *                     properties:
 *                         status:
 *                             type: string
 *                             example: success
 *             400:
 *                 description: Bad input parameter
 */

router.delete('/security-transaction/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const securityTransaction = await SecurityTransaction.findById(params.uuid);
        if (!securityTransaction) notFound('SecurityTransaction not found');
        await securityTransaction.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
