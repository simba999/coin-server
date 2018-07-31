import { Request, Response } from 'express';
import * as express from 'express';
import { number, object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { Account } from '../models/account';
import { Security } from '../models/security';
import { notFound } from 'boom';
import { v4 as uuid } from 'uuid';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   SecurityInfo:
 *     type: object
 *     required:
 *     - type
 *     - name
 *     - authorized
 *     - liquidation
 *     - accountId
 *     properties:
 *       type:
 *         type: string
 *         enum: [warrant, preferred_stock, common_stock', option]
 *         example: preferred_stock
 *       name:
 *         type: string
 *         example: Security 1
 *       authorized:
 *         type: number
 *         example: 21
 *       liquidation:
 *         type: string
 *         example: liquidation 1
 *       accountId:
 *         type: string
 *         format: uuid
 *         example: 5172e1e8-7c0e-47ee-9fe1-082c619de99f
 */

/**
 * @swagger
 *   /security:
 *     post:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Security
 *       operationId: createSecurity
 *       description: Create a security.
 *       consumes:
 *       - application/json
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: json_data
 *         description: |
 *           Json Data of security to create
 *         schema:
 *           $ref: '#/definitions/SecurityInfo'
 *       responses:
 *         200:
 *           description: Created security successfully
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
 *                     example: Created security successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: ddfa7024-812e-4f1f-92be-ab167010549b
 *         400:
 *           description: Invalid input, object invalid
 */
router.post('/security',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            authorized: number(),
            liquidation: string().max(255),
            accountId: string().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const account = await Account.findById(body.accountId);
        if (!account) notFound('Account not found');

        const security = await Security.create(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Created security successfully',
                'uuid': security.uuid
            }
        });
    }),
);

/**
 * @swagger
 *   /security:
 *     put:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Security
 *       operationId: updateSecurity
 *       description: Update a security information.
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
 *           - securityId
 *           properties:
 *             securityId:
 *               type: string
 *               format: uuid
 *               example: ddfa7024-812e-4f1f-92be-ab167010549b
 *             type:
 *               type: string
 *               enum: [warrant, preferred_stock, common_stock', option]
 *               example: preferred_stock
 *             name:
 *               type: string
 *               example: Security 1
 *             authorized:
 *               type: number
 *               example: 21
 *             liquidation:
 *               type: string
 *               example: liquidation 1
 *             accountId:
 *               type: string
 *               format: uuid
 *               example: 5172e1e8-7c0e-47ee-9fe1-082c619de99f
 *       responses:
 *         200:
 *           description: Updated security successfully
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
 *                     example: Updated security successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: ddfa7024-812e-4f1f-92be-ab167010549b
 *         400:
 *           description: Invalid input, object invalid
 */
router.put('/security',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            securityId: string().required(),
            name: string().max(255),
            type: string().valid(['warrant', 'preferred_stock', 'common_stock', 'option']),
            authorized: number(),
            liquidation: string().max(255),
            accountId: string(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const security = await Security.findById(body.securityId);
        if (!security) notFound('Security not found');

        if (body.accountId) {
            const account = await Account.findById(body.accountId);
            if (!account) notFound('Account not found');
        }

        await security.update(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Updated security successfully',
                'uuid': security.uuid
            }
        });
    }),
);

/**
 * @swagger
 *   /security/{uuid}:
 *     get:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Security
 *       operationId: getSecurity
 *       description: |
 *         Get the security information
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: path
 *         name: uuid
 *         type: string
 *         format: uuid
 *         required: true
 *         description: Pass search uuid for an unique security
 *       responses:
 *         200:
 *           description: Get security information successfully
 *           schema:
 *             $ref: '#/definitions/SecurityInfo'
 *         400:
 *           description: Bad input parameter
 */
router.get('/security/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const security = await Security.findById(params.uuid);
        if (!security) notFound('Security not found');
        res.json({
            status: 'success',
            data: security
        });
    }),
);

/**
 * @swagger
 *   /security/{uuid}:
 *     delete:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Security
 *       operationId: deleteSecurity
 *       description: |
 *         Delete the security information
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: path
 *         name: uuid
 *         type: string
 *         format: uuid
 *         required: true
 *         description: Pass delete uuid for an unique security
 *       responses:
 *         200:
 *           description: Delete security information successfully
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *         400:
 *           description: Bad input parameter
 */
router.delete('/security/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const security = await Security.findById(params.uuid);
        if (!security) notFound('Security not found');
        await security.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
