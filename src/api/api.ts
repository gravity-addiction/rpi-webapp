'use strict';
import * as express from 'express';
import { API, APIConfig, IAPISettings } from './api-ctrl';

const apiSettings: Partial<IAPISettings> = {
  http_port: 6193,
  app_folder: '../web',

  bodyparserJson: {},
  bodyparserUrlencoded: {extended: true},

  cookies: true,
  csurf: true,

  rbac: true,
  rbacDefinition: {
    guest: {
      can: [
        'sysinfo:view'
      ]
    },
    admin: {
      can: ['sysinfo:edit'],
      inherits: ['guest']
    }
  }
};

// Initialize ExpressJS as app
const app = express();
// Preconfiguation of express app
// apiDotSettings is the updated config version that includes info from .env
const apiDotSettings = APIConfig(app, apiSettings);

// import modules
import * as SysinfoRoutes from '../modules/sysinfo/api';
app.use(SysinfoRoutes);

import * as SpotifyModule from '../modules/spotify/api';
app.use(SpotifyModule);


// serve static files from app_folder (default: ../web)
app.get('*.*', express.static(apiDotSettings.app_folder, { maxAge: '1y' }));

// server any application path from app_folder (default: ../web)
app.all('*', function (req: express.Request, res: express.Response) {
  console.log(req.url, req.method);
  res.status(200).sendFile(`/`, {root: apiDotSettings.app_folder});
});


// Setup API Listener
const { sslserver, server } = API(app, apiDotSettings);
