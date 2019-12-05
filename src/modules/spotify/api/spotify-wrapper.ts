'use strict';

import * as urljoin from 'url-join';
import * as request from 'request';
import * as SpotifyAuthCtrl from './spotify-auth.ctrl';

function makeSpotifyCall(callType: string, url: string, query: any, token: string, body: any = null) {
  return new Promise((res, rej) => {
    const opts: any = {
      url: urljoin('https://api.spotify.com/', url),
      qs: query,
      headers: { 'Authorization': 'Bearer ' + token },
      json: true
    };

    if (callType.toLocaleLowerCase() !== 'get' && body !== null) {
      opts.body = body;
    }

    request[callType.toLocaleLowerCase()](
      opts,
      (errMe, respMe, bodyMe) => {
        if (errMe) {
          rej({status: 400, error: errMe});
        } else {
          res({http: respMe, body: bodyMe});
        }
      }
    );
  }).catch(err => {
    throw err;
  });
}


export default async function(callType: string, url: string, query: any, body: any) {
  const uri = query.uri || '',
        state = query.state || '';

  const callTypeLC = callType.toLocaleLowerCase();
  let authRecord = await SpotifyAuthCtrl.getAuth(state, uri).catch(err => console.log('Auth Error', err));

  // Refresh an Auth token expiring within the next two minutes
  if (authRecord.token_expires < ((new Date().getTime()) - 120000)) {
    authRecord = await SpotifyAuthCtrl.refreshAuthToken(authRecord.token_state_auth).catch(err => {
      return Promise.reject({status: 400, error: 'Token Renewal Required'});
    });
  }

  // Filter Query
  query = Object.keys(query)
        .filter(k => (k !== 'state' && k !== 'uri'))
        .reduce((q, k) => (q[k] = query[k], q), {} );

  if (authRecord) {
    return makeSpotifyCall(callTypeLC,
      url,
      query,
      authRecord.access_token,
      body
    );
  } else {
    return Promise.reject({status: 400, error: 'No Authorization Available'});
  }
}
