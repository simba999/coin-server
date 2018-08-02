import { Request, Response } from 'express';
import * as express from 'express';
import { date, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Account } from '../../models/account';
import { badRequest, notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /account/{uuid}:
 *     get:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Account
 *         operationId: getAccount
 *         description: |
 *             Get the account information
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass search uuid for an unique account
 *         responses:
 *             200:
 *                 description: Get account information successfully
 *                 schema:
 *                     $ref: '#/definitions/AccountInfo'
 *             400:
 *                 description: Bad input parameter
 */

router.get('/account/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const account = await Account.findById(params.uuid);
        if (!account) notFound('Account not found');
        res.json({
            status: 'success',
            data: account
        });
    }),
);

export default router;
