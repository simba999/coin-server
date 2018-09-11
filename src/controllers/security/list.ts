import { Request, Response } from 'express';
import * as express from 'express';
import { object } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Security } from '../../models/security';
import { badData } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /security/list/{uuid}:
 *     get:
 *       security:
 *       - Bearer: []
 *       tags:
 *       - Security
 *       operationId: getSecurityList
 *       description: |
 *           Get the security list for specific account
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: path
 *         name: uuid
 *         type: string
 *         format: uuid
 *         required: true
 *         description: Pass account uuid for get security list
 *       responses:
 *         200:
 *           description: Get security list successfully
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/SecurityInfo'
 *         400:
 *           description: Bad input parameter
 */

router.get('/security/list/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const securities = await Security.findAll({
            where: {
                accountId: params.uuid
            }
        });
        if (!securities) throw badData('Securities not found');
        res.json({
            status: 'success',
            data: securities
        });
    }),
);

export default router;
