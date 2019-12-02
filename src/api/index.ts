'use strict';
import * as express from 'express';
import { API, APIConfig } from '../../api';
import { IAPISettings } from '../../api/models/i-api-settings';

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

console.log(process.env.JWT_SECRET);
// Define Routes for API
import * as SysinfoRoutes from './routes/sysinfo';

// Add Route pointers to array for later looping
const routes = [
  SysinfoRoutes,
];


// Initialize ExpressJS as app
const app = express();

// Preconfiguation of express app
// apiDotSettings is the updated config version that includes info from .env
const apiDotSettings = APIConfig(app, apiSettings);

// configure routes, looping predefined routes array
routes.map(r => app.use(r));

// serve static files from app_folder (default: ../web)
app.get('*.*', express.static(apiDotSettings.app_folder, { maxAge: '1y' }));

// server any application path from app_folder (default: ../web)
app.all('*', function (req: express.Request, res: express.Response) {
  res.status(200).sendFile(`/`, {root: apiDotSettings.app_folder});
});

// Setup API Listener
API(app, apiDotSettings);
