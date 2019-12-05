'use strict';

import { parseDotEnv } from '../../../../api-ctrl';
import { join } from 'path';
import * as express from 'express';
const router = express.Router({ mergeParams: true });

parseDotEnv(join(__dirname, './modules/spotify/api/.env'));

import * as SpotifyAuthRoutes from '../api/spotify-auth.routes';
router.use(SpotifyAuthRoutes);

import * as SpotifyRoutes from '../api/spotify.routes';
router.use(SpotifyRoutes);

export = router;
