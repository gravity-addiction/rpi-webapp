'use strict';

import * as express from 'express';
const router = express.Router({ mergeParams: true });

import * as SysinfoRoutes from './sysinfo.routes';
router.use(SysinfoRoutes);

export = router;
