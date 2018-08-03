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
 *     delete:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Security
 *         operationId: deleteSecurity
 *         description: |
 *             Delete the security information
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass delete uuid for an unique security
 *         responses:
 *             200:
 *                 description: Delete security information successfully
 *                 schema:
 *                     type: object
 *                     properties:
 *                         status:
 *                             type: string
 *                             example: success
 *             400:
 *                 description: Bad input parameter
 */

router.delete('/security/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const security = await Security.findById(params.uuid);
        if (!security) badData('Security not found');
        await security.destroy();

        res.json({
            status: 'success'
        });
    }));

export default router;
