import { Request, Response } from 'express';
import * as express from 'express';
import { boolean, number, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Security } from '../models/security';
import { SecurityTransaction } from '../models/security_transaction';
import { Shareholder } from '../models/shareholder';
import { notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   SecurityTransactionInfo:
 *     type: object
 *     required:
 *     - status
 *     - shares
 *     - price
 *     - restricted
 *     - restrictedUntil
 *     - issueDate
 *     - securityId
 *     - shareholderId
 *     properties:
 *       status:
 *         type: boolean
 *         example: false
 *       shares:
 *         type: number
 *         format: int32
 *         example: 234.5
 *       price:
 *         type: number
 *         format: int32
 *         example: 10.5
 *       restricted:
 *         type: boolean
 *         example: false
 *       restrictUntil:
 *         type: string
 *         format: date
 *         example: 2018/09/25
 *       issueDate:
 *         type: string
 *         format: date
 *         example: 2018/08/01
 *       securityId:
 *         type: string
 *         format: uuid
 *         example: 26716619-b2a2-4f41-a7b3-e80110292c3d
 *       shareholderId:
 *         type: string
 *         format: uuid
 *         example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 */

/**
 * @swagger
 *   /security-transaction:
 *     post:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - SecurityTransaction
 *       operationId: createSecurityTransaction
 *       description: Create a security-transaction.
 *       consumes:
 *       - application/json
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: json_data
 *         description: |
 *           Json Data of security-transaction to create
 *         schema:
 *           $ref: '#/definitions/SecurityTransactionInfo'
 *       responses:
 *         200:
 *           description: Created security transaction successfully
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
 *                     example: Created security transaction successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: ddfa7024-812e-4f1f-92be-ab167010549b
 *         400:
 *           description: Invalid input, object invalid
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

/**
 * @swagger
 *   /security-transaction:
 *     put:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - SecurityTransaction
 *       operationId: updateSecurityTransaction
 *       description: Update a security transaction information.
 *       consumes:
 *       - application/json
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: json_data
 *         description: |
 *           Json Data of security transaction to update
 *         schema:
 *           type: object
 *           required:
 *           - securityTransactionId
 *           properties:
 *             securityTransactionId:
 *               type: string
 *               format: uuid
 *               example: 2218f615-975b-463c-a6db-85ef8e6464d0
 *             status:
 *               type: boolean
 *               example: false
 *             shares:
 *               type: number
 *               format: int32
 *               example: 234.5
 *             price:
 *               type: number
 *               format: int32
 *               example: 10.5
 *             restricted:
 *               type: boolean
 *               example: false
 *             restrictUntil:
 *               type: string
 *               format: date
 *               example: 2018/09/25
 *             issueDate:
 *               type: string
 *               format: date
 *               example: 2018/08/01
 *             securityId:
 *               type: string
 *               format: uuid
 *               example: 26716619-b2a2-4f41-a7b3-e80110292c3d
 *             shareholderId:
 *               type: string
 *               format: uuid
 *               example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 *       responses:
 *         200:
 *           description: Updated security transaction successfully
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
 *                     example: Updated security transaction successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: 2218f615-975b-463c-a6db-85ef8e6464d0
 *         400:
 *           description: Invalid input, object invalid
 */
router.put('/security-transaction',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            securityTransactionId: string().required(),
            status: boolean(),
            shares: number(),
            price: number(),
            restricted: boolean(),
            restrictedUntil: string().max(255),
            issueDate: string().max(255),
            securityId: string().max(255),
            shareholderId: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const securityTransaction = await SecurityTransaction.findById(body.securityTransactionId);
        if (!securityTransaction) notFound('SecurityTransaction not found');

        await securityTransaction.update(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Updated security transaction successfully',
                'uuid': securityTransaction.uuid
            }
        });
    }),
);

/**
 * @swagger
 *   /security-transaction/{uuid}:
 *     get:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - SecurityTransaction
 *       operationId: getSecurityTransaction
 *       description: |
 *         Get the security transaction information
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: path
 *         name: uuid
 *         type: string
 *         format: uuid
 *         required: true
 *         description: Pass search uuid for an unique security transaction
 *       responses:
 *         200:
 *           description: Get security transaction information successfully
 *           schema:
 *             $ref: '#/definitions/SecurityTransactionInfo'
 *         400:
 *           description: Bad input parameter
 */
router.get('/security-transaction/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const securityTransaction = await SecurityTransaction.findById(params.uuid);
        if (!securityTransaction) notFound('SecurityTransaction not found');

        res.json({
            status: 'success',
            data: securityTransaction
        });
    }),
);

/**
 * @swagger
 *   /security-transaction/{uuid}:
 *     delete:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - SecurityTransaction
 *       operationId: deleteSecurityTransaction
 *       description: |
 *         Delete the security transaction information
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: path
 *         name: uuid
 *         type: string
 *         format: uuid
 *         required: true
 *         description: Pass delete uuid for an unique security transaction
 *       responses:
 *         200:
 *           description: Deleted security transaction information successfully
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *         400:
 *           description: Bad input parameter
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
