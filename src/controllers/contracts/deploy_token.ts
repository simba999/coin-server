import { Request, Response } from 'express';
import * as express from 'express';
import { date, object, string } from 'joi';
import { errorWrap } from '../../utils';
import validate from '../../middleware/validate';
import { badRequest } from 'boom';
import passport from 'passport';
import dotenv from 'dotenv';
import HDWalletProvider from 'truffle-hdwallet-provider';
import contract from 'truffle-contract';

const Web3 = require('web3');

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /token/deploy:
 *     post:
 *         security:
 *         - Bearer: []
 *         tags:
 *         - Token
 *         operationId: deployToken
 *         description: Deploy new token with info
 *         consumes:
 *         - application/json
 *         produces:
 *         - application/json
 *         parameters:
 *         - in: body
 *           name: json_data
 *           description: |
 *               Json Data of account to create
 *           schema:
 *               $ref: '#/definitions/AccountInfo'
 *         responses:
 *             200:
 *                 description: Created account successfully
 *                 schema:
 *                     $ref: '#/definitions/AccountInfo'
 *             400:
 *                 description: Invalid input, object invalid
 */

router.post('/deploy-ishu',
    passport.authenticate('jwt', { session: false }),
    validate({
        body: object().keys({
            name: string().max(255).required(),
            ticker: date().required(),
        }),
    }),
    errorWrap(async (req: Request, res: Response) => {
        const body = req.body;

        const ishuETS_controller = require('/build/contracts/IshuETS.json');
        const ropsten_infura_server = process.env.ROPSTEN_INFURA_SERVER;
        const rinkeby_infura_server = process.env.RINKEBY_INFURA_SERVER;
        const main_infura_server = process.env.MAINNET_INFURA_SERVER;
        const mnemonic = process.env.MNEMONIC;

        const provider = new HDWalletProvider(mnemonic, rinkeby_infura_server);
        const web3 = new Web3(provider);

        const ishuETSController = contract(ishuETS_controller);
        ishuETSController.setProvider(provider);
        ishuETSController.new();
    }),
);

export default router;