import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { User } from '../../models/user';
import { Shareholder } from '../../models/shareholder';
import { badData } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /shareholder/{uuid}:
 *     get:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Shareholder
 *         operationId: getShareholder
 *         description: |
 *             Get the shareholder information
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass search uuid for an unique shareholder
 *         responses:
 *             200:
 *                 description: Get shareholder information successfully
 *                 schema:
 *                     $ref: '#/definitions/ShareholderInfo'
 *             400:
 *                 description: Bad input parameter
 */

router.get('/shareholder/:uuid',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({}),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const params = req.params;

        const shareholder = await Shareholder.findById(params.uuid);
        if (!shareholder) throw badData('Shareholder not found');
        res.json({
            status: 'success',
            data: shareholder
        });
    }),
);

export default router;
