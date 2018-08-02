import { Request, Response } from 'express';
import * as express from 'express';
import { object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { User } from '../../models/user';
import { Shareholder } from '../../models/shareholder';
import { notFound } from 'boom';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /shareholder/{uuid}:
 *     delete:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Shareholder
 *         operationId: deleteShareholder
 *         description: |
 *             Delete the shareholder information
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: path
 *           name: uuid
 *           type: string
 *           format: uuid
 *           required: true
 *           description: Pass delete uuid for an unique shareholder
 *         responses:
 *             200:
 *                 description: Delete shareholder information successfully
 *                 schema:
 *                     type: object
 *                     properties:
 *                         status:
 *                             type: string
 *                             example: success
 *             400:
 *                 description: Bad input parameter
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
