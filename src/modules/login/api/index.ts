'use strict';

import * as express from 'express';
const router = express.Router({ mergeParams: true });

import * as LoginRoutes from './login.routes';
router.use(LoginRoutes);

export = router;
