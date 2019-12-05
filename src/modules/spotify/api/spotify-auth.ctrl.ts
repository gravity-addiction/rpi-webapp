'use strict';

import { Router, Request, Response } from 'express';
import * as urljoin from 'url-join';
import * as request from 'request';
import * as shortid from 'shortid';

import { DB } from '../../db';

const default_shortid_chars = 'CDEPQMtuvw56cd~1eFG2WXYZab.iABsklxyRnNOfgh4oH3IJjm78_pqrzL90STUV',
      shortid_chars = process.env.SHORTID_CHARS || default_shortid_chars,
      shortid_removewords = process.env.SHORTID_REMOVEWORDS || 'fuck';

// Error checking shortid charactor set length is valid
try {
  shortid.characters(shortid_chars);
} catch (e) {
  console.log('Invalid Short ID Charactors:', e.message);
  console.log('Invalid Set:', shortid_chars);
  console.log('Reverting Short ID to Default Charset');
  shortid.characters(default_shortid_chars);
}

const spotify_auth_url = 'https://accounts.spotify.com/authorize';

const searchWords = shortid_removewords;
const searchExp = new RegExp(searchWords.split(',').join('|'), 'gi');

export async function getAuth(state, uri) {
  let authRecord;
  // Get Auth By db state id
  if (state) {
    authRecord = await DB.knex('spotify_auth').
                  select('spotify_auth.*').
                  where('token_state_auth', state).
                  first().
                  catch(err => {
                    throw err;
                  });
  }

  // Get Auth by URI
  if (!authRecord && uri) {
    authRecord = await DB.knex('spotify_me').
              leftJoin('spotify_auth', 'spotify_auth.me_id', 'spotify_me.id').
              select('spotify_auth.*').
              where('spotify_auth.uri', uri).
              orderBy('spotify_auth.token_expires', 'DESC').
              first().
              catch(err => {
                throw err;
              });
  }

  // Get Default Auth Account
  if (!authRecord && !state && !uri) {
    authRecord = await DB.knex('spotify_me').
              leftJoin('spotify_auth', 'spotify_auth.me_id', 'spotify_me.id').
              select('spotify_auth.*').
              orderBy('spotify_auth.token_expires', 'DESC').
              first().
              catch(err => {
                throw err;
              });
  }
  return authRecord;
}

export async function initAuthUrl(host) {
  const spotify_keys = await DB.knex('spotify_keys').select('*').orderBy('id', 'DESC').first();

  // Track Authentication Request State in SQL
  const state = createStateAuth();
  const spotify_redirect =  urljoin(host, '/api/spotify/callback');
  const spotify_auth_scope = 'user-library-read user-library-modify user-read-playback-state ' +
                             'user-read-currently-playing user-read-recently-played user-modify-playback-state ' +
                             'playlist-read-collaborative playlist-modify-private playlist-modify-public ' +
                             'playlist-read-private user-top-read user-follow-read user-follow-modify';

  await DB.knex('spotify_auth').insert({
    client_id: spotify_keys.spotify_client_id,
    token_scope: spotify_auth_scope,
    redirect_uri: spotify_redirect,
    token_state_auth: state
  });

  // Redirect to URL
  return spotify_auth_url +
    '?client_id=' + encodeURIComponent(spotify_keys.spotify_client_id) +
    '&response_type=code' +
    '&redirect_uri=' + encodeURIComponent(spotify_redirect) +
    '&scope=' + encodeURIComponent(spotify_auth_scope) +
    '&state=' + encodeURIComponent(state) +
    '&show_dialog=true';
}

export function initAuthCallback(state, code) {
  return new Promise(async (res, rej) => {
    const dbToken = await DB.knex('spotify_auth').select('*').where('token_state_auth', state).first();
    const tokenResp = await fetchAuthToken(
      state,
      {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: dbToken.redirect_uri
      }
    ).catch(err => rej(err));

    if (tokenResp) {
      // Create user info
      const userInfo = await refreshUserInfo(state).catch(err => rej(err));
      if (userInfo) {
        // Update auth record with user id
        await DB.knex('spotify_auth').update({
          me_id: userInfo[1]
        }).where('token_state_auth', state).catch(err => {
          console.log('Error, Me ID Update!', err);
        });
        // Redirect to spotify page
        res(userInfo);
      } else {
        rej({status: 400, error: 'Unable to fetch user information'});
      }
    } else {
      rej({status: 404, error: 'No Auth Initalized'});
    }
  });
}
export function createStateAuth() {

  let ret = shortid.generate();
  while (shortid_removewords && searchExp.test(ret)) { ret = shortid.generate(); }
  return ret;
}

// Update Auth Token from https://accounts.spotify.com/api/token
export function updateAuthToken(state, body) {
  // Add Access Token to Auth Record
  const newAuthInfo: any = {
    access_token: body.access_token || '',
    token_type: body.token_type || '',
    token_expires: Math.round((new Date().getTime()) + ((body.expires_in || 3600) * 1000))
  };
  if (body.refresh_token) { newAuthInfo.refresh_token = body.refresh_token; }

  return DB.knex('spotify_auth').update(newAuthInfo).
  where('token_state_auth', state).catch(err => {
    console.log('Update Auth Token Error!', err);
  });
}

export function refreshUserInfo(state) {
  return new Promise(async (res, rej) => {
    const dbToken = await DB.knex('spotify_auth').select('*').where('token_state_auth', state).first();
    // use the access token to access the Spotify Web API
    request.get(
      {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + dbToken.access_token },
        json: true
      },
      async (errMe, respMe, bodyMe) => {
        if (errMe) {
          rej({status: 400, error: errMe});
        } else if (!errMe && respMe.statusCode === 200) {
          const meURI = bodyMe.uri || '';
          let me = await DB.knex('spotify_me').select('id').where('uri', meURI).first();

          // Doesn't Exist insert
          if (!me) {
            const meId = await DB.knex('spotify_me').insert({
              uri: meURI,
              name: bodyMe.display_name || '',
              me_type: bodyMe.type || '',
              me_json: JSON.stringify(bodyMe)
            }).catch(err => {
              console.log('Error, Inserting Me!', err);
            })
            // assign new id
            me = { id: meId[0] };
          } else {
            // Update with new info
            await DB.knex('spotify_me').update({
              name: bodyMe.display_name || '',
              me_type: bodyMe.type || '',
              me_json: JSON.stringify(bodyMe)
            }).where('id', me.id).catch(err => {
              console.log('Error, Updating Me!', err);
            });
          }

          res(me.id);
        } else {
          rej({status: respMe.statusCode, error: 'Unknown Response Status'});
        }
      }
    );
  });
}

export async function refreshAuthToken(state) {

  const dbToken = await DB.knex('spotify_auth').select('*').where('token_state_auth', state).first();
  if (!dbToken.refresh_token) {
    return Promise.reject({status: 404, error: 'No Refresh Token'});
  }

  return fetchAuthToken(
    state,
    {
      grant_type: 'refresh_token',
      refresh_token: dbToken.refresh_token
    }
  );
}

export function fetchAuthToken(state, formData) {
  return new Promise(async(res, rej) => {
    const spotify_keys = await DB.knex('spotify_keys').select('*').orderBy('id', 'DESC').first();

    // Get Record by State
    request.post(
      'https://accounts.spotify.com/api/token',
      {
        auth: {
          'user': spotify_keys.spotify_client_id,
          'pass': spotify_keys.spotify_client_secret
        },
        form: formData,
        json: true
      },
      async (err, httpResponse, body) => {
        if (err) {
          rej({status: 500, error: 'Token Request Error'});
        } else if (!err && httpResponse.statusCode === 200) {
          // update database
          await updateAuthToken(state, body);
          res(body);
        } else {
          rej({status: 400, error: body});
        }
      }
    );
  });
}

export async function saveKeys(client_id: string, client_secret: string) {
  const spotify_keys = await DB.knex('spotify_keys').select('*').
                        where('spotify_client_id', client_id);
  if (spotify_keys.length) {
    return DB.knex('spotify_keys').update({
      'spotify_client_secret': client_secret
    }).where('spotify_client_id', client_id);
  } else {
    return DB.knex('spotify_keys').insert({
      'spotify_client_id': client_id,
      'spotify_client_secret': client_secret
    });
  }
}

export async function createDBTables() {
  await DB.knex.raw(`
    CREATE TABLE IF NOT EXISTS "spotify_auth" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "me_id" INTEGER,
      "client_id" TEXT,
      "token_type" TEXT,
      "access_token" TEXT,
      "refresh_token" TEXT,
      "token_expires" INTEGER,
      "token_scope" TEXT,
      "redirect_uri" TEXT,
      "token_state_auth" TEXT
    )
  `);

  await DB.knex.raw(`
    CREATE TABLE IF NOT EXISTS "spotify_me" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "uri" TEXT,
      "name" TEXT,
      "me_type" TEXT,
      "me_json" TEXT
    );
  `);

  return DB.knex.raw(`
    CREATE TABLE IF NOT EXISTS "spotify_keys" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "spotify_client_id" TEXT,
      "spotify_client_secret" TEXT
    );
  `);
}

