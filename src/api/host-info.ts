import { Request } from 'express';
import Url = require('url');

export namespace HostInfo {

  'use strict';

  export function getHost(req: Request): string {
    const host = getOrigin(req) || '';
    if (host) { return Url.parse(host).host; }
    return host;
  }

  export function getIp(req: Request): string {
    const headers: any = req.headers || {},
          connection: any = req.connection || {};
    return headers['x-forwarded-for'] || connection.remoteAddress || '';
  }

  export function getOrigin(req: Request): string {
    const headers: any = req.headers || {};
    return headers.referer || req.get('origin');
  }

}
