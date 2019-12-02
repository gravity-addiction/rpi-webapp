'use strict';

import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

// Creates new Token and Inserts DB record
export function createToken(body: any, ip: string = '', useragent: string | string[] = ''): Promise<Array<any>> {
  body.jti = uuidv4();
  const token = signToken(body);
  return Promise.resolve([null, token]);
}

export function deleteToken(jti: string): Promise<Array<any>> {
  return Promise.resolve([null, true]);
}

export function getTokenInfo(req: Request, res: Response, checkExpired: boolean = true) {
  const token = retrieveAuthToken(req) || '',
        tokenSecret = process.env.JWT_SECRET || 'pleaseDontHackMeBecauseImStupid',
        verifyOptions = {
          ignoreExpiration: !checkExpired
        };

  if (!token) { 
    return false;
  }
  try {
    const userInfo = jwt.verify(unstripToken(token), tokenSecret, verifyOptions);
    return userInfo;
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      deleteAuthToken(req, res);
    } else if (err.name === 'TokenExpiredError') {
      deleteAuthToken(req, res);
    } else {
      console.log(err.name, err.message);
    }
    return false;
  }
}

export function updateToken(jti: string): Promise<Array<any>> {
  return Promise.resolve([null, true]);
}


// Sign JWT Token
export function signToken(body: any): string {
  const tokenTimeout = process.env.JWT_TIMEOUT || '1h',
        tokenSecret = process.env.JWT_SECRET || 'pleaseDontHackMeBecauseImStupid';

  return jwt.sign(body, tokenSecret, { expiresIn: tokenTimeout });
}

export function resignToken(body: any): string {
  delete body.exp;
  delete body.iat;
  return signToken(body);
}

export function stripToken(token: string): string {
  return token.substring(token.indexOf('.') + 1);
}

export function unstripToken(token: string): string {
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}`;
}

// Validate JWT Token
export function validateToken(req: Request, res: Response, next): void {
  const token = retrieveAuthToken(req);

  if (!token) {
    res.status(401).end();
  } else {
    const tokenInfo = getTokenInfo(req, res, false),
          curTime = Math.floor((new Date()).getTime() / 1000),
          tokenExp = tokenInfo.exp || 0;

    findToken(tokenInfo.jti).then(tokenValid => {
      if (tokenValid && tokenInfo && (tokenExp > curTime)) {
        // Token Valid, Not Expired
        next();
      } else {
        // Token is Dead
        res.status(498).end();
      }
    }).catch(err => {
      console.log('Validate Token Error (controllers/tokens.ts)', err);
      res.status(498).end();
    });
  }
}




// Fetch Authorization Token
export function retrieveAuthToken(req: Request): string {
  const cookieToken = req.cookies['_JWT'] || '',
        bearerHeader = req.get('Authorization') || '',
        bearerToken = splitBearerToken(bearerHeader),
        token = (cookieToken) ? cookieToken : bearerToken;

  return token;
}

export function setAuthToken(req: Request, res: Response, token: string, rememberme: boolean = false): void {
  let cookieSupport = false;
  try {
    if (req.cookies && req.cookies.hasOwnProperty('cookieSupport')) {
      cookieSupport = true;
    }
  } catch (err) { cookieSupport = false; }

  const cookieOptions: any = {
    secure: true,
    domain: process.env.JWT_DOMAIN || '.localhost'
  };
  if (rememberme) {
    cookieOptions.expires = new Date(new Date().setFullYear(new Date().getFullYear() + 2));
  }

  if (cookieSupport) {
    req.cookies._JWT = stripToken(token);
    res.cookie('_JWT', stripToken(token), cookieOptions);
  } else {
    req.headers['authorization'] = `Bearer ${stripToken(token)}`;
    res.header('X-JWT', stripToken(token));
  }
}

export function deleteAuthToken(req: Request, res: Response): void {
  try { delete req.cookies._JWT; } catch (e) { }
  try { delete req.headers.authorization; } catch (e) { }
  try { res.header('X-JWT', 'unset'); } catch (e) { }

  try {
    if (req.cookies && req.cookies.hasOwnProperty('cookieSupport')) {
      res.cookie('_JWT', '');
    }
  } catch (err) { }
}


export function splitBearerToken(credential: string) {
  const parts = credential.trim().split(' ') || [];
  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return token;
    } else {
      return '';
    }
  } else { return ''; }
}


// Find Token in Database
export function findToken(token: string): Promise<any> {
  return Promise.resolve([{ id: 1, role: 'admin' }]);
}

function uuidv4() {
  return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
    a => ((a ^ crypto.randomBytes(1)[0] * 16 >> a / 4).toString(16))[0]
  );
}
