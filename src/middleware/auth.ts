import { NextFunction, Request, Response } from 'express';
import { methodNotAllowed, unauthorized } from 'boom';
import jwt from 'jsonwebtoken';
import { errorWrap } from '../utils';
import { User } from '../models/user';

export function authorize() {
    return errorWrap(async (req: Request, res: Response, next: NextFunction) => {
        if (!('authorization' in req.headers)) throw methodNotAllowed('Missing authorization header');

        const token = (req.headers['authorization'] as any).split(' ')[1];

        let payload: any;
        try {
            payload = jwt.verify(token, process.env.SALT || 'salt');
        } catch (err) {
            throw unauthorized(err.name);
        }

        const user = await User.findById(payload.user_id);
        if (!user) throw unauthorized('User not found');

        res.locals.user = user;
        return next();
    });
}