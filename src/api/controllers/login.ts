'use strict';
import { compareSync } from 'bcryptjs';
import { readFileSync } from 'fs';

// Main Authentication Routine that checks a username / password combination
export function authenticate(user: any): Promise<Array<any>> {
  const password = user.password || '';
  
  if (password == 'raspberry') {
    return Promise.resolve([null, 1]);
  } else {
    return Promise.resolve(['bad_password']);
  }

  /* Pull password from file and comparesync it
  const passwd = readFileSync('./passwd', 'utf8');
  if (compareSync(password, passwd)) {
    return Promise.resolve([null, 1]);
  } else {
    return Promise.resolve(['bad_password']);
  }
  */
}
