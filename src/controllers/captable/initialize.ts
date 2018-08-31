import { Request, Response } from 'express';
import * as express from 'express';
import { array, number, object, required, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Account } from '../../models/account';
import { Security } from '../../models/security';
import { Shareholder } from '../../models/shareholder';
import { UserAccount } from '../../models/user_account';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /captable/initialize:
 *     post:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - CapTable
 *         operationId: initializeCapTable
 *         description: Initialize captable data from input.
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json data of initial input information
 *           schema:
 *               type: object
 *               properties:
 *                   name:
 *                       type: string
 *                       example: Company Name
 *                   incDate:
 *                       type: string
 *                       example: 2018/08/01
 *                   website:
 *                       type: string
 *                       example: https://localhost:5000
 *                   currency:
 *                       type: string
 *                       example: EUR
 *                   country:
 *                       type: string
 *                       example: US
 *                   state:
 *                       type: string
 *                       example: STATE
 *                   funding:
 *                       type: string
 *                       enum:
 *                       - Not Raised Any Money
 *                       - Raised Via Notes Only
 *                       - Seed Stage
 *                       - Series A or Later
 *                       example: Not Raised Any Money
 *                   role:
 *                       type: string
 *                       enum:
 *                       - owner
 *                       - employee
 *                       - shareholder
 *                       example: owner
 *                   securities:
 *                       type: array
 *                       items:
 *                           type: object
 *                           properties:
 *                               type:
 *                                   type: string
 *                                   enum:
 *                                   - warrant
 *                                   - preferred_stock
 *                                   - common_stock
 *                                   - option
 *                                   example: warrant
 *                               name:
 *                                   type: string
 *                                   example: Security name 1
 *                               authorized:
 *                                   type: number
 *                                   example: 12343
 *                               liquidation:
 *                                   type: string
 *                                   example: Liquidation 1
 *                   shareholders:
 *                       type: array
 *                       items:
 *                           type: object
 *                           properties:
 *                               name:
 *                                   type: string
 *                                   example: Shareholder name 1
 *                               type:
 *                                   type: string
 *                                   enum:
 *                                   - individual
 *                                   - non-individual
 *                                   example: individual
 *                               invitedEmail:
 *                                   type: string
 *                                   format: email
 *                                   example: sh1@yopmail.com
 *                               address:
 *                                   type: string
 *                                   example: Address Loc 1
 *         responses:
 *             200:
 *                 description: Created captable data successfully
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
 *                                     example: Created captable data successfully
 *             400:
 *                 description: Invalid input, object invalid
 */

router.post('/initialize',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            name: string().required().max(255),
            incDate: string().required(),
            website: string().required(),
            currency: string().required(),
            country: string().required(),
            state: string().required(),
            funding: string().required().valid(['Not Raised Any Money', 'Raised Via Notes Only', 'Seed Stage', 'Series A or Later']),
            role: string().required().valid(['owner', 'employee', 'shareholder']),
            securities: array().required(),
            shareholders: array().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        // Create Account with company type
        body.type = 'company';
        const account = await Account.create(body);

        // create securities
        for (const obj of body.securities) {
            const security = await Security.create(obj);
            await security.updateAttributes({'accountId': account.uuid});
        }

        // create shareholders
        for (const obj of body.shareholders) {
            const shareholder = await Shareholder.create(obj);

            await UserAccount.create({
                'shareholderId': shareholder.uuid,
                'accountId': account.uuid,
                'role': 'employee',
            });
        }

        res.json({
            'status': 'success',
            'data': {
                'message': 'Created captable data successfully'
            }
        });
    }),
);

export default router;
