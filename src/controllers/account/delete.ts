import { Request, Response } from 'express';
import * as express from 'express';
import { date, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Account } from '../../models/account';
import { badData, badRequest } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /account/{uuid}:
 *     delete:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Account
 *         operationId: deleteAccount
 *         description: |
 *             Delete the account information
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass delete uuid for an unique account
 *         responses:
 *             200:
 *                 description: Delete account information successfully
 *                 schema:
 *                     type: object
 *                     properties:
 *                         status:
 *                             type: string
 *                             example: success
 *             400:
 *                 description: Bad input parameter
 */

router.delete('/account/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const account = await Account.findById(params.uuid);
        if (!account) throw badData('Account not found');
        await account.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
