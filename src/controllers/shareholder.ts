import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../utils';
import validate from '../middleware/validate';
import { User } from '../models/user';
import { Shareholder } from '../models/shareholder';
import { notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   ShareholderInfo:
 *     type: object
 *     required:
 *     - name
 *     - type
 *     - invitedEmail
 *     - address
 *     properties:
 *       name:
 *         type: string
 *         example: Shareholder 1
 *       type:
 *         type: string
 *         enum: [individual, non-individual]
 *         example: individual
 *       invitedEmail:
 *         type: string
 *         format: email
 *         example: shareholder@yopmail.com
 *       address:
 *         type: string
 *         example: new york, united state
 */

/**
 * @swagger
 *   /shareholder:
 *     post:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Shareholder
 *       operationId: createShareholder
 *       description: Create a shareholder.
 *       consumes:
 *       - application/json
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: json_data
 *         description: |
 *           Json Data of shareholder to create
 *         schema:
 *           $ref: '#/definitions/ShareholderInfo'
 *       responses:
 *         200:
 *           description: Created shareholder successfully
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
 *                     example: Created shareholder successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: ddfa7024-812e-4f1f-92be-ab167010549b
 *         400:
 *           description: Invalid input, object invalid
 */
router.post('/shareholder',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            name: string().max(255).required(),
            type: string().valid(['individual', 'non-individual']),
            invitedEmail: string().required().email(),
            address: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholder = await Shareholder.create(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Created shareholder successfully',
                'uuid': shareholder.uuid
            }
        });
    }),
);

/**
 * @swagger
 *   /shareholder:
 *     put:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Shareholder
 *       operationId: updateShareholder
 *       description: Update a shareholder information.
 *       consumes:
 *       - application/json
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: json_data
 *         description: |
 *           Json Data of shareholder to update
 *         schema:
 *           type: object
 *           required:
 *           - shareholderId
 *           properties:
 *             shareholderId:
 *               type: string
 *               format: uuid
 *               example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 *             name:
 *               type: string
 *               example: Shareholder 1
 *             type:
 *               type: string
 *               enum: [individual, non-individual]
 *               example: individual
 *             invitedEmail:
 *               type: string
 *               format: email
 *               example: shareholder@yopmail.com
 *             address:
 *               type: string
 *               example: new york, united state
 *       responses:
 *         200:
 *           description: Updated shareholder information successfully
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
 *                     example: Updated shareholder successfully
 *                   uuid:
 *                     type: string
 *                     format: uuid
 *                     example: 6f93c9d4-51a0-497d-9f71-a07961d78e97
 *         400:
 *           description: Invalid input, object invalid
 */
router.put('/shareholder',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            shareholderId: string().required(),
            name: string().max(255),
            type: string().valid(['individual', 'non-individual']),
            invitedEmail: string().email(),
            address: string().max(255),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const shareholder = await Shareholder.findById(body.shareholderId);
        if (!shareholder) notFound('Shareholder not found');

        await shareholder.update(body);

        res.json({
            status: 'success',
            data: {
                'message': 'Updated shareholder successfully',
                'uuid': shareholder.uuid
            }
        });
    }),
);

/**
 * @swagger
 *   /shareholder/{uuid}:
 *     get:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Shareholder
 *       operationId: getShareholder
 *       description: |
 *         Get the shareholder information
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: path
 *         name: uuid
 *         type: string
 *         format: uuid
 *         required: true
 *         description: Pass search uuid for an unique shareholder
 *       responses:
 *         200:
 *           description: Get shareholder information successfully
 *           schema:
 *             $ref: '#/definitions/ShareholderInfo'
 *         400:
 *           description: Bad input parameter
 */
router.get('/shareholder/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const shareholder = await Shareholder.findById(params.uuid);
        if (!shareholder) notFound('Shareholder not found');
        res.json({
            status: 'success',
            data: shareholder
        });
    }),
);

/**
 * @swagger
 *   /shareholder/{uuid}:
 *     delete:
 *       security:
 *         - Bearer: []
 *       tags:
 *       - Shareholder
 *       operationId: deleteShareholder
 *       description: |
 *         Delete the shareholder information
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: path
 *         name: uuid
 *         type: string
 *         format: uuid
 *         required: true
 *         description: Pass delete uuid for an unique shareholder
 *       responses:
 *         200:
 *           description: Delete shareholder information successfully
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *         400:
 *           description: Bad input parameter
 */
router.delete('/shareholder/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const shareholder = await Shareholder.findById(params.uuid);
        if (!shareholder) notFound('Shareholder not found');
        await shareholder.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
