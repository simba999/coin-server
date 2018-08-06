import * as express from 'express';

import CreateAccount from './controllers/account/create';
import UpdateAccount from './controllers/account/update';
import GetAccount from './controllers/account/get';
import DeleteAccount from './controllers/account/delete';

import CreateSecurity from './controllers/security/create';
import UpdateSecurity from './controllers/security/update';
import GetSecurity from './controllers/security/get';
import DeleteSecurity from './controllers/security/delete';
import ListSecurity from './controllers/security/list';

import CreateSecurityTransaction from './controllers/security_transaction/create';
import UpdateSecurityTransaction from './controllers/security_transaction/update';
import GetSecurityTransaction from './controllers/security_transaction/get';
import DeleteSecurityTransaction from './controllers/security_transaction/delete';

import CreateShareholder from './controllers/shareholder/create';
import UpdateShareholder from './controllers/shareholder/update';
import GetShareholder from './controllers/shareholder/get';
import DeleteShareholder from './controllers/shareholder/delete';

import SignUp from './controllers/user/signup';
import SignIn from './controllers/user/signin';
import ChangePassword from './controllers/user/changepassword';

import InitializeCaptable from './controllers/captable/initialize';

const router = express.Router();

router.use('/', CreateAccount);
router.use('/', UpdateAccount);
router.use('/', GetAccount);
router.use('/', DeleteAccount);

router.use('/', CreateSecurity);
router.use('/', UpdateSecurity);
router.use('/', GetSecurity);
router.use('/', DeleteSecurity);
router.use('/', ListSecurity);

router.use('/', CreateSecurityTransaction);
router.use('/', UpdateSecurityTransaction);
router.use('/', GetSecurityTransaction);
router.use('/', DeleteSecurityTransaction);

router.use('/', CreateShareholder);
router.use('/', UpdateShareholder);
router.use('/', GetShareholder);
router.use('/', DeleteShareholder);

router.use('/', SignUp);
router.use('/', SignIn);
router.use('/', ChangePassword);

router.use('/captable', InitializeCaptable);

export default router;