import { Request, Response } from 'express';
import * as express from 'express';
import { number, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { Account } from '../../models/account';
import { Security } from '../../models/security';
import { badData } from 'boom';
import { v4 as uuid } from 'uuid';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /security/{uuid}:
 *     get:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Security
 *         operationId: getSecurity
 *         description: |
 *             Get the security information
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass search uuid for an unique security
 *         responses:
 *             200:
 *                 description: Get security information successfully
 *                 schema:
 *                     $ref: '#/definitions/SecurityInfo'
 *             400:
 *                 description: Bad input parameter
 */

router.get('/security/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const security = await Security.findById(params.uuid);
        if (!security) throw badData('Security not found');
        res.json({
            status: 'success',
            data: security
        });
    }),
);

export default router;
