import { Request, Response } from 'express';
import * as express from 'express';
import { date, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { badRequest, notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   AccountInfo:
 *     type: object
 *     required:
 *     - type
 *     - name
 *     - incDate
 *     - currency
 *     - country
 *     - state
 *     - funding
 *     properties:
 *       type:
 *         type: string
 *         enum: [company]
 *         example: company
 *       name:
 *         type: string
 *         example: New Company
 *       incDate:
 *         type: string
 *         example: 2016/08/29
 *       website:
 *         type: string
 *         example: http://ishu.com
 *       currency:
 *         type: string
 *         example: USD
 *       country:
 *         type: string
 *         example: United State
 *       state:
 *         type: string
 *         example: New York
 *       funding:
 *         type: string
 *         enum: [Not Raised Any Money, Raised Via Notes Only, Seed Stage, Series A or Later]
 *         example: Not Raised Any Money
 */

/**
 * @swagger
 *   /account:
 *     post:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Account
 *       operationId: createAccount
 *       description: Create an account. For now 'compnay'.
 *       consumes:
 *       - application/json
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: json_data
 *         description: |
 *           Json Data of account to create
 *         schema:
 *           $ref: '#/definitions/AccountInfo'
 *       responses:
 *         200:
 *           description: Created account successfully
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *               data:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Created account successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: c72b37ed-9582-4120-a062-0065fd7b4ba6
 *         400:
 *           description: Invalid input, object invalid
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
        res.json({
            status: 'success',
            data: {
                'message': 'Created account successfully',
                'uuid': account.uuid
            }
        });
    }),
);

/**
 * @swagger
 *   /account:
 *     put:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Account
 *       operationId: updateAccount
 *       description: Update an account information.
 *       consumes:
 *       - application/json
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: json_data
 *         description: |
 *           Json Data of account to update
 *         schema:
 *           type: object
 *           required:
 *           - accountId
 *           properties:
 *             accountId:
 *               type: string
 *               format: uuid
 *               example: 5172e1e8-7c0e-47ee-9fe1-082c619de99f
 *             type:
 *               type: string
 *               enum: [company]
 *               example: company
 *             name:
 *               type: string
 *               example: New Company
 *             incDate:
 *               type: string
 *               example: 2016/08/29
 *             website:
 *               type: string
 *               example: http://ishu.com
 *             currency:
 *               type: string
 *               example: USD
 *             country:
 *               type: string
 *               example: United State
 *             state:
 *               type: string
 *               example: New York
 *             funding:
 *               type: string
 *               example: Not Raised Any Money
 *       responses:
 *         200:
 *           description: Updated account successfully
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *               data:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Updated account successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: 5a269bb3-a851-4d9c-bef3-d9177bd038c7
 *         400:
 *           description: Invalid input, object invalid
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

/**
 * @swagger
 *   /account/{uuid}:
 *     get:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Account
 *       operationId: getAccount
 *       description: |
 *         Get the account information
 *       produces:
 *       - application/json
 *       parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass search uuid for an unique account
 *       responses:
 *         200:
 *           description: Get account information successfully
 *           schema:
 *             $ref: '#/definitions/AccountInfo'
 *         400:
 *           description: Bad input parameter
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

/**
 * @swagger
 *   /account/{uuid}:
 *     delete:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Account
 *       operationId: deleteAccount
 *       description: |
 *         Delete the account information
 *       produces:
 *       - application/json
 *       parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass delete uuid for an unique account
 *       responses:
 *         200:
 *           description: Delete account information successfully
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *         400:
 *           description: Bad input parameter
 */
router.delete('/account/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const account = await Account.findById(params.uuid);
        if (!account) notFound('Account not found');
        await account.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
