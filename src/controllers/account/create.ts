import { Request, Response } from 'express';
import * as express from 'express';
import { date, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Account } from '../../models/account';
import { badRequest } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *     AccountInfo:
 *         type: object
 *         required:
 *         - type
 *         - name
 *         - incDate
 *         - currency
 *         - country
 *         - state
 *         - funding
 *         properties:
 *             type:
 *                 type: string
 *                 enum: [company]
 *                 example: company
 *             name:
 *                 type: string
 *                 example: New Company
 *             incDate:
 *                 type: string
 *                 example: 2016/08/29
 *             website:
 *                 type: string
 *                 example: http://ishu.com
 *             currency:
 *                 type: string
 *                 example: USD
 *             country:
 *                 type: string
 *                 example: United State
 *             state:
 *                 type: string
 *                 example: New York
 *             funding:
 *                 type: string
 *                 enum: [Not Raised Any Money, Raised Via Notes Only, Seed Stage, Series A or Later]
 *                 example: Not Raised Any Money
 */

/**
 * @swagger
 * /account:
 *     post:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Account
 *         operationId: createAccount
 *         description: Create an account. For now 'compnay'.
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of account to create
 *           schema:
 *               $ref: '#/definitions/AccountInfo'
 *         responses:
 *             200:
 *                 description: Created account successfully
 *                 schema:
 *                     $ref: '#/definitions/AccountInfo'
 *             400:
 *                 description: Invalid input, object invalid
 */

router.post('/account',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            type: string().valid(['company']).required(),
            name: string().max(255).required(),
            incDate: date().required(),
            website: string(),
            currency: string().max(255),
            country: string().max(255).required(),
            state: string().max(255).required(),
            funding: string().valid(['Not Raised Any Money', 'Raised Via Notes Only', 'Seed Stage', 'Series A or Later']).required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.create(body);
        res.status(200)
            .json({
                status: 'success',
                data: {
                    'message': 'Created account successfully',
                    account
                }
            });
    }),
);

export default router;