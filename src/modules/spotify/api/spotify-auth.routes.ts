'use strict';

import { Router, Request, Response } from 'express';
import * as SpotifyAuthCtrl from './spotify-auth.ctrl';
import * as urljoin from 'url-join';

const router = Router();

router.put('/api/spotify/developer_keys', async (req: Request, res: Response) => {
  const body = req.body || {},
        client_id = body.client_id || '',
        client_secret = body.client_secret || '';

  await SpotifyAuthCtrl.createDBTables();

  SpotifyAuthCtrl.saveKeys(client_id, client_secret).then(tokenResp => {
    res.status(201).json(tokenResp);
  }).catch(err => {
    console.log(err);
    res.status((err.status || 400)).json(err.error);
  });

});

router.get('/api/spotify/auth', async (req: Request, res: Response) => {
  // Check DB Tables are created
  await SpotifyAuthCtrl.createDBTables();

  // Initialize Auth record, create URL
  const spotify_authorize_url = SpotifyAuthCtrl.initAuthUrl(urljoin(req.protocol + '://' + req.headers.host));

  // Start browser journey
  res.redirect(spotify_authorize_url);
});

router.put('/api/spotify/refresh/:state', async (req: Request, res: Response) => {
  const params = req.params || {},
        state = params.state || '';

  if (!state) { res.status(400).end(); }

  SpotifyAuthCtrl.refreshAuthToken(state).then(tokenResp => {
    res.status(201).json(tokenResp);
  }).catch(err => {
    res.status(err.status).json(err.error);
  });
});


router.get('/api/spotify/callback', async (req: Request, res: Response) => {
  const query = req.query || {},
        code = query.code || '',
        state = query.state || '';

  SpotifyAuthCtrl.initAuthCallback(state, code).then(userInfo => {
    res.redirect('/#/spotify');
  }).catch(err => {
    res.status(err.status).send(err.error);
  });
});

export = router;
