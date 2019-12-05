'use strict';

import { Router, Request, Response, Next } from 'express';
import * as urljoin from 'url-join';
import SpotifyWrapper from './spotify-wrapper';

const router = Router();

router.all('/api/spotify/v1/:me*', async (req: Request, res: Response, next: Next) => {
  const params = req.params || {},
        me = params.me || '',
        meStar = params[0] || '',
        query = req.query || {},
        body = ((req.method || '').toLocaleLowerCase() === 'get') ? req.body : null;

  SpotifyWrapper(req.method, urljoin('v1/', me, meStar), query, body).then((result: any) => {
    // Reply Status, Body
    res.status(((result.http || {}).statusCode || 200)).json((result.body || {}));
  }).catch(err => {
    // Catch Errors with status 400 default
    res.status((err.status || 400));
    if (typeof err.error === 'object') {
      res.json(err.error);
    } else { res.send(err.error); }
  });
});

export = router;
