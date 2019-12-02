import express = require('express');

import * as bodyParser from 'body-parser';
import cors = require('cors');
import { readFileSync } from 'fs';
import { createServer as http_createServer } from 'http';
import { createServer as https_createServer } from 'https';

import { IAPISettings } from './models/i-api-settings';
import minimist = require('minimist');

const debug = require('debug')('api');

export function APIErrorHandler(app: express.Application, settings?: Partial<IAPISettings>) {
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send(err.message);
    } else {
      res.status(500).send('Something broke!');
    }
  });
}

export function APIConfig(app: express.Application, settings?: Partial<IAPISettings>): Partial<IAPISettings> {
  const args: any = minimist(process.argv);

  let dotenv: any = {};
  if (args.env) {
    dotenv = require('dotenv').config({ path: args.env });
  } else {
    try { dotenv = require('dotenv').config({ path: __dirname + '/.env' }); } catch (e) { }
  }

  // App_Folder - Static HTML Files
  if (parseBool(args.app_folder || dotenv.APP_FOLDER || false)) {
    settings.app_folder = args.app_folder || dotenv.APP_FOLDER || settings.app_folder;
  }

  // CORS - Whitelisting
  if (parseBool(args.use_cors || dotenv.USE_CORS || settings.use_cors || true)) {
    const whitelist = args.whitelist || dotenv.WHITELIST || settings.whitelist || true;
    app.use(cors({
      origin: whitelist,
      credentials: true
    }));
  }

  // Add compression
  if (parseBool(args.compression || dotenv.COMPRESSION || settings.compression || false)) {
    const compression = require('compression');
    app.use(compression());
  }

  // mount body parsers parser
  // JSON Parser
  const bodyparserJson = args.bodyparser_json || dotenv.bodyparser_json || settings.bodyparserJson || false;
  if (bodyparserJson) { app.use(bodyParser.json(bodyparserJson)); }

  // URL Encoded Parser
  const bodyparserUrlencoded = args.bodyparser_urlencoded || dotenv.BODYPARSER_URLENCODE || settings.bodyparserUrlencoded || false;
  if (bodyparserUrlencoded) { app.use(bodyParser.urlencoded(bodyparserUrlencoded)); }

  // Text parser
  const bodyparserText = args.bodyparser_text || dotenv.bodyparser_text || settings.bodyparserText || false;
  if (bodyparserText) { app.use(bodyParser.text(bodyparserText)); }

/*
  const multer = require('multer');
  app.use(multer({
    dest: '/Users/strictdev1/Documents/dsm-mono/uploads/',
    rename: function (fieldname, filename) {
      return filename + Date.now();
    },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
  }).single());
*/

  // Add Cookie Parser
  if (parseBool(args.cookies || dotenv.COOKIES || settings.cookies || false)) {
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
  }

  // configure jade
  if (parseBool(args.jade || dotenv.JADE || settings.jade || false)) {
    const jadeViews = args.jade_views || dotenv.JADE_VIEWS || settings.jade_views || './views';
    app.set('views', jadeViews);
    app.set('view engine', 'jade');
  }

  // configure easy-rbac
  if (parseBool(args.rbac || dotenv.RBAC || settings.rbac || false)) {
    const rbacDefinition = settings.rbacDefinition || {};
    const rbac = require('easy-rbac');
    app.use(rbac.main(rbacDefinition));
  }

  // Unauthorized
  const unauthorizedError = args.unauthorizedError || dotenv.unauthorizedError || settings.unauthorizedError || 'No token provided.';
  if (parseBool(unauthorizedError)) {
    app.use(function(err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        return res.status(403).send({
          success: false,
          message: unauthorizedError
        });
      }
    });
  }

  return settings;
}

export function API(app: express.Application, settings?: Partial<IAPISettings>) {
  const args: any = minimist(process.argv);
  let dotenv: any = {};
  if (args.env) {
    dotenv = require('dotenv').config({ path: args.env });
  } else {
    try { dotenv = require('dotenv').config({ path: __dirname + '/.env' }); } catch (e) { }
  }

  const http_server = parseBool(args.http_server || dotenv.HTTP_SERVER || settings.http_server || true),
        https_server = parseBool(args.https_server || dotenv.HTTPS_SERVER || settings.https_server || false)
  ;

  // HTTPS Server
  if (https_server) {

    // HTTPS Settings
    const sslIp = args.https_ip || dotenv.HTTPS_IP || settings.https_ip || '0.0.0.0';
    const sslPort = normalizePort(args.https_port || dotenv.HTTPS_PORT || settings.https_port || 3443);
    const sslCert = {
      key: readFileSync(args.https_key || dotenv.HTTPS_KEY || settings.https_key),
      cert: readFileSync(args.https_cert || dotenv.HTTPS_CERT || settings.https_cert)
    };
    app.set('sslport', sslPort);
    app.set('sslip', sslIp);

    // Start SSL Server
    const sslserver = https_createServer(sslCert, app);
    sslserver.listen(sslPort, sslIp, () => {
      console.log('Created Listener on https://' + sslIp + ':' + sslPort);
    });

    sslserver.on('error', (err) => onError(err, sslPort));
    sslserver.on('listening', () => onListening(sslserver.address()));
  }

  if (http_server) {
    // Start HTTP if SSL isn't active or on non-conflicting ports
    const ip = args.ip || process.env.IP || dotenv.IP || settings.http_ip || '0.0.0.0';
    const port = normalizePort(args.port || process.env.PORT || dotenv.PORT || settings.http_port || 3080);
    app.set('port', port);
    app.set('ip', ip);

    const server = http_createServer(app);
    server.listen(port, ip, () => {
      console.log('Created Listener on http://' + ip + ':' + port);
    });

    server.on('connect', () => onConnection());
    server.on('connection', () => onConnection());
    server.on('error', (err) => onError(err, port));
    server.on('listening', () => onListening(server.address()));

  }

  /* process.on('uncaughtException', function (exception) {
    debug(exception);
  });
  */

  // Redirect CTRL-C Stops to Exit Normally
  process.on('SIGINT', () => {
    process.exit(0);
  });

  // Clean up from running processes
  process.on('exit', () => {
    debug('\nShutting Down..\n');
  });
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Parse boolean values into proper true/false
 */
function parseBool(str) {
  if (str == null) { return false; }
  if (typeof str === 'boolean') { return (str === true); }
  if (typeof str === 'string' && str === '') {
    return false;
  } else if (typeof str === 'string') {
    str = str.replace(/^\s+|\s+$/g, '');
    if (str.toLowerCase() === 'true' || str.toLowerCase() === 'yes') { return true; }
    str = str.replace(/,/g, '.');
    str = str.replace(/^\s*\-\s*/g, '-');
  }
  if (!isNaN(str)) { return (parseFloat(str) !== 0); }
  return false;
}


/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error, port) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening(addr) {
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


/**
 * Event listen for HTTP Connections
 */
function onConnection() { }
