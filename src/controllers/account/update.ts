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
 * /account:
 *     put:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Account
 *         operationId: updateAccount
 *         description: Update an account information.
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
 *               - accountId
 *               properties:
 *                   accountId:
 *                       type: string
 *                       format: uuid
 *                       example: 5172e1e8-7c0e-47ee-9fe1-082c619de99f
 *                   type:
 *                       type: string
 *                       enum: [company]
 *                       example: company
 *                   name:
 *                       type: string
 *                       example: New Company
 *                   incDate:
 *                       type: string
 *                       example: 2016/08/29
 *                   website:
 *                       type: string
 *                       example: http://ishu.com
 *                   currency:
 *                       type: string
 *                       example: USD
 *                   country:
 *                       type: string
 *                       example: United State
 *                   state:
 *                       type: string
 *                       example: New York
 *                   funding:
 *                       type: string
 *                       example: Not Raised Any Money
 *         responses:
 *             200:
 *                 description: Updated account successfully
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
 *                                     example: Updated account successfully
 *                                 uuid:
 *                                     type: string
 *                                     format: uuid
 *                                     example: 5a269bb3-a851-4d9c-bef3-d9177bd038c7
 *             400:
 *                 description: Invalid input, object invalid
 */

router.put('/account',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            accountId: string().required(),
            type: string().valid(['company']).required(),
            name: string().max(255).required(),
            incDate: date().required(),
            website: string(),
            currency: string().max(255),
            country: string().max(255).required(),
            state: string().max(255).required(),
            funding: string().valid(['Not Raised Any Money', 'Raised Via Notes Only', 'Seed Stage', 'Series A or Later']).required()
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.findById(body.accountId);
        if (!account) notFound('Account not found');

        await account.update(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Updated account successfully',
                'uuid': account.uuid
            }
        });
    }),
);

export default router;
