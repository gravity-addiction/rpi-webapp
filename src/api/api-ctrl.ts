import express = require('express');

import * as bodyParser from 'body-parser';
import { join } from 'path';
import cors = require('cors');
import { readFileSync } from 'fs';
import { createServer as http_createServer, Server } from 'http';
import { createServer as https_createServer } from 'https';

import minimist = require('minimist');

import * as SocketIOModule from './api-socket-io';

export class IAPISettings {
  http_server: boolean;
  http_ip: string;
  http_port: number;

  https_server: boolean;
  https_ip: string;
  https_port: number;
  https_key: string;
  https_cert: string;

  use_socket_io: boolean;

  app_folder: string;

  show_sql: boolean;

  use_cors: boolean;
  whitelist: string|string[];

  bodyparserJson: any;
  bodyparserUrlencoded: any;
  bodyparserText: any;

  jade: boolean;
  jade_views: string;

  logger: string;

  compression: boolean;

  rbac: boolean;
  rbacDefinition: any;

  cookies: boolean;
  csurf: boolean;

  unauthorizedError: string;
}

export function parseDotEnv(path) {
  let dotenv;
  try {
    dotenv = require('dotenv').config({ path: path });
  } catch (e) {
    console.log('Parse Dot Env Error:', e.message);
    return null;
  }

  if (dotenv.hasOwnProperty('parsed') && dotenv.parsed !== null) {
    const objKeys = Object.keys(dotenv.parsed),
          objI = objKeys.length;
    for (let i = 0; i < objI; i++) {
      try { process.env[objKeys[i]] = dotenv.parsed[objKeys[i]]; } catch (e) { }
    }
    return dotenv.parsed;
  }
  return null;
}

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

  if (args.env) {
    console.log('Default .env:', args.env);
    parseDotEnv(args.env);
  } else {
    console.log('Default .env:', join(__dirname, './.env'));
    parseDotEnv(join(__dirname, './.env'));
  }


  // App_Folder - Static HTML Files
  if (args.app_folder || process.env.APP_FOLDER || false) {
    settings.app_folder = args.app_folder || process.env.APP_FOLDER || settings.app_folder;
    console.log('Use App Folder', settings.app_folder);
  }

  // CORS - Whitelisting
  if (parseBool(args.use_cors || process.env.USE_CORS || settings.use_cors || true)) {
    const whitelist = args.whitelist || process.env.WHITELIST || settings.whitelist || true;
    app.use(cors({
      origin: whitelist,
      credentials: true
    }));
  }

  // Add compression
  if (parseBool(args.compression || process.env.COMPRESSION || settings.compression || false)) {
    const compression = require('compression');
    app.use(compression());
  }

  // mount body parsers parser
  // JSON Parser
  const bodyparserJson = args.bodyparser_json || process.env.bodyparser_json || settings.bodyparserJson || false;
  if (bodyparserJson) { app.use(bodyParser.json(bodyparserJson)); }

  // URL Encoded Parser
  const bodyparserUrlencoded = args.bodyparser_urlencoded || process.env.BODYPARSER_URLENCODE || settings.bodyparserUrlencoded || false;
  if (bodyparserUrlencoded) { app.use(bodyParser.urlencoded(bodyparserUrlencoded)); }

  // Text parser
  const bodyparserText = args.bodyparser_text || process.env.bodyparser_text || settings.bodyparserText || false;
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
  if (parseBool(args.cookies || process.env.COOKIES || settings.cookies || false)) {
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
  }

  // configure jade
  if (parseBool(args.jade || process.env.JADE || settings.jade || false)) {
    const jadeViews = args.jade_views || process.env.JADE_VIEWS || settings.jade_views || './views';
    app.set('views', jadeViews);
    app.set('view engine', 'jade');
  }

  // configure easy-rbac
  if (parseBool(args.rbac || process.env.RBAC || settings.rbac || false)) {
    const rbacDefinition = settings.rbacDefinition || {};
    const rbac = require('easy-rbac');
    app.use(rbac.main(rbacDefinition));
  }

  // Unauthorized
  const unauthorizedError = args.unauthorizedError || process.env.unauthorizedError || settings.unauthorizedError || 'No token provided.';
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

  const http_server = parseBool(args.http_server || process.env.HTTP_SERVER || settings.http_server || true),
        https_server = parseBool(args.https_server || process.env.HTTPS_SERVER || settings.https_server || false),
        use_socket_io = parseBool(args.use_socket_io || process.env.USE_SOCKET_IO || settings.use_socket_io || true)
  ;

  let sslserver: Server,
      server: Server;

  // HTTPS Server
  if (https_server) {

    // HTTPS Settings
    const sslIp = args.https_ip || process.env.HTTPS_IP || settings.https_ip || '0.0.0.0';
    const sslPort = normalizePort(args.https_port || process.env.HTTPS_PORT || settings.https_port || 3443);
    const sslCert = {
      key: readFileSync(args.https_key || process.env.HTTPS_KEY || settings.https_key),
      cert: readFileSync(args.https_cert || process.env.HTTPS_CERT || settings.https_cert)
    };
    app.set('sslport', sslPort);
    app.set('sslip', sslIp);

    // Start SSL Server
    sslserver = https_createServer(sslCert, app);
    sslserver.listen(sslPort, sslIp, () => {
      console.log('Created Listener on https://' + sslIp + ':' + sslPort);
    });

    sslserver.on('error', (err) => onError(err, sslPort));
    sslserver.on('listening', () => onListening(sslserver.address()));
  }

  if (http_server) {
    // Start HTTP if SSL isn't active or on non-conflicting ports
    const ip = args.ip || process.env.IP || process.env.IP || settings.http_ip || '0.0.0.0';
    const port = normalizePort(args.port || process.env.PORT || process.env.PORT || settings.http_port || 3080);
    app.set('port', port);
    app.set('ip', ip);

    server = http_createServer(app);
    server.listen(port, ip, () => {
      console.log('Created Listener on http://' + ip + ':' + port);
    });

    server.on('connect', () => onConnection());
    server.on('connection', () => onConnection());
    server.on('error', (err) => onError(err, port));
    server.on('listening', () => onListening(server.address()));

  }

  // Socket-IO
  if (use_socket_io) {
    SocketIOModule.init(sslserver, server);
  }

  /* process.on('uncaughtException', function (exception) {
    console.log(exception);
  });
  */

  // Redirect CTRL-C Stops to Exit Normally
  process.on('SIGINT', () => {
    process.exit(0);
  });

  // Clean up from running processes
  process.on('exit', () => {
    console.log('\nShutting Down..\n');
  });

  return { sslserver: sslserver, server: server };
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
      console.log(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(bind + ' is already in use');
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
  console.log('Listening on ' + bind);
}


/**
 * Event listen for HTTP Connections
 */
function onConnection() { }
