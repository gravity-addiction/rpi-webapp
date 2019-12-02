'use strict';

import { Router, Request, Response } from 'express';
import * as Login from '../controllers/login';
import * as Tokens from '../controllers/tokens-jwt-simple';

const router = Router();

router.post('/api/authenticate', async (req: Request, res: Response) => {
  const body = req.body || {},
        rememberme = !!body.rememberme || false;

  // Authenticate Use Signin with Username / Password
  const [loginErr, id] = await Login.authenticate(body);
  if (loginErr) {
    console.log('Login Error (routes/login.ts)', loginErr);
    res.status(401).end();
  }

  if (id) { // Auth Good
    // Create JWT Token for Client
    const jwtBody = {
      user: id,
      role: 'admin'
    };

    const ip = req.ip,
          userAgent = req.headers['user-agent'];

    const [tokenErr, token] = await Tokens.createToken(jwtBody, ip, userAgent);
    if (tokenErr) {
      console.log('Token Error (routes/login.ts)', tokenErr);
      return res.status(500).end({error: tokenErr});
    }

    // Assign Token to Cookies or as X-JWT Header
    Tokens.setAuthToken(req, res, token, rememberme);
    res.status(204).end();
  } else {
    res.status(401).end();
  }

});

router.delete('/api/authenticate', async (req: Request, res: Response) => {
  const tokenInfo = Tokens.getTokenInfo(req, res, false),
        jti = tokenInfo.jti || '';

  if (!jti) {
    res.status(498).end();
  } else {
    const [tokenErr, resp] = await Tokens.deleteToken(tokenInfo.jti);
    if (tokenErr) {
      console.log('Cannot Delete Token (routes/login.ts)', tokenInfo.jti);
      res.status(500).end({error: tokenErr});
    } else {
      res.status(204).end();
    }
  }
});

export = router;
