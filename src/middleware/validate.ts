import { Schema, validate as JoiValidate } from 'joi';
import { badRequest as BadRequest } from 'boom';
import { errorWrap } from '../utils';
import { NextFunction, Request, Response } from 'express';

export interface IValidateInput {
    params?: Schema;
    query?: Schema;
    body?: Schema;
}

export default function validate(schema: IValidateInput) {
    return errorWrap(async function (req: Request, res: Response, next: NextFunction) {
        if (schema.params) {
            const validation = JoiValidate(req.params, schema.params, {abortEarly: false});
            if (validation.error) {
                throw BadRequest('Invalid params', validation.error.details);
            }
        }

        if (schema.query) {
            const validation = JoiValidate(req.query, schema.query, {abortEarly: false});
            if (validation.error) {
                throw BadRequest('Invalid query', validation.error.details);
            }
            req.query = validation.value;
        }

        if (schema.body) {
            const validation = JoiValidate(req.body, schema.body, {abortEarly: false});
            if (validation.error) {
                throw BadRequest(`Invalid input`, validation.error.details);
            }
            req.body = validation.value;
        }

        next();
    });
}

