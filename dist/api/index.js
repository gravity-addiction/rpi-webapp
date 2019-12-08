/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/api/api.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/dotenv/lib/main.js":
/*!***************************************************************!*\
  !*** /Users/gary/Development/node_modules/dotenv/lib/main.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(/*! fs */ "fs")
const path = __webpack_require__(/*! path */ "path")

/*
 * Parses a string or buffer into an object
 * @param {(string|Buffer)} src - source to be parsed
 * @returns {Object} keys and values from src
*/
function parse (src) {
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split('\n').forEach(function (line) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]

      // default undefined or missing values to empty string
      let value = keyValueArr[2] || ''

      // expand newlines in quoted values
      const len = value ? value.length : 0
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n')
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim()

      obj[key] = value
    }
  })

  return obj
}

/*
 * Main entry point into dotenv. Allows configuration before loading .env
 * @param {Object} options - options for parsing .env file
 * @param {string} [options.path=.env] - path to .env file
 * @param {string} [options.encoding=utf8] - encoding of .env file
 * @returns {Object} parsed object or error
*/
function config (options) {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'

  if (options) {
    if (options.path) {
      dotenvPath = options.path
    }
    if (options.encoding) {
      encoding = options.encoding
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }))

    Object.keys(parsed).forEach(function (key) {
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = parsed[key]
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.load = config
module.exports.parse = parse


/***/ }),

/***/ "./src/api/api-ctrl.ts":
/*!*****************************!*\
  !*** ./src/api/api-ctrl.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
var path_1 = __webpack_require__(/*! path */ "path");
var cors = __webpack_require__(/*! cors */ "cors");
var fs_1 = __webpack_require__(/*! fs */ "fs");
var http_1 = __webpack_require__(/*! http */ "http");
var https_1 = __webpack_require__(/*! https */ "https");
var minimist = __webpack_require__(/*! minimist */ "minimist");
var SocketIOModule = __webpack_require__(/*! ./api-socket-io */ "./src/api/api-socket-io.ts");
var IAPISettings = /** @class */ (function () {
    function IAPISettings() {
    }
    return IAPISettings;
}());
exports.IAPISettings = IAPISettings;
function parseDotEnv(path) {
    var dotenv;
    try {
        dotenv = __webpack_require__(/*! dotenv */ "../../node_modules/dotenv/lib/main.js").config({ path: path });
    }
    catch (e) {
        console.log('Parse Dot Env Error:', e.message);
        return null;
    }
    if (dotenv.hasOwnProperty('parsed') && dotenv.parsed !== null) {
        var objKeys = Object.keys(dotenv.parsed), objI = objKeys.length;
        for (var i = 0; i < objI; i++) {
            try {
                process.env[objKeys[i]] = dotenv.parsed[objKeys[i]];
            }
            catch (e) { }
        }
        return dotenv.parsed;
    }
    return null;
}
exports.parseDotEnv = parseDotEnv;
function APIErrorHandler(app, settings) {
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send(err.message);
        }
        else {
            res.status(500).send('Something broke!');
        }
    });
}
exports.APIErrorHandler = APIErrorHandler;
function APIConfig(app, settings) {
    var args = minimist(process.argv);
    if (args.env) {
        console.log('Default .env:', args.env);
        parseDotEnv(args.env);
    }
    else {
        console.log('Default .env:', path_1.join(__dirname, './.env'));
        parseDotEnv(path_1.join(__dirname, './.env'));
    }
    // App_Folder - Static HTML Files
    if (args.app_folder || process.env.APP_FOLDER || false) {
        settings.app_folder = args.app_folder || process.env.APP_FOLDER || settings.app_folder;
        console.log('Use App Folder', settings.app_folder);
    }
    // CORS - Whitelisting
    if (parseBool(args.use_cors || process.env.USE_CORS || settings.use_cors || true)) {
        var whitelist = args.whitelist || process.env.WHITELIST || settings.whitelist || true;
        app.use(cors({
            origin: whitelist,
            credentials: true
        }));
    }
    // Add compression
    if (parseBool(args.compression || process.env.COMPRESSION || settings.compression || false)) {
        var compression = __webpack_require__(/*! compression */ "compression");
        app.use(compression());
    }
    // mount body parsers parser
    // JSON Parser
    var bodyparserJson = args.bodyparser_json || process.env.bodyparser_json || settings.bodyparserJson || false;
    if (bodyparserJson) {
        app.use(bodyParser.json(bodyparserJson));
    }
    // URL Encoded Parser
    var bodyparserUrlencoded = args.bodyparser_urlencoded || process.env.BODYPARSER_URLENCODE || settings.bodyparserUrlencoded || false;
    if (bodyparserUrlencoded) {
        app.use(bodyParser.urlencoded(bodyparserUrlencoded));
    }
    // Text parser
    var bodyparserText = args.bodyparser_text || process.env.bodyparser_text || settings.bodyparserText || false;
    if (bodyparserText) {
        app.use(bodyParser.text(bodyparserText));
    }
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
        var cookieParser = __webpack_require__(/*! cookie-parser */ "cookie-parser");
        app.use(cookieParser());
    }
    // configure jade
    if (parseBool(args.jade || process.env.JADE || settings.jade || false)) {
        var jadeViews = args.jade_views || process.env.JADE_VIEWS || settings.jade_views || './views';
        app.set('views', jadeViews);
        app.set('view engine', 'jade');
    }
    // configure easy-rbac
    if (parseBool(args.rbac || process.env.RBAC || settings.rbac || false)) {
        var rbacDefinition = settings.rbacDefinition || {};
        var rbac = __webpack_require__(/*! easy-rbac */ "easy-rbac");
        app.use(rbac.main(rbacDefinition));
    }
    // Unauthorized
    var unauthorizedError = args.unauthorizedError || process.env.unauthorizedError || settings.unauthorizedError || 'No token provided.';
    if (parseBool(unauthorizedError)) {
        app.use(function (err, req, res, next) {
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
exports.APIConfig = APIConfig;
function API(app, settings) {
    var args = minimist(process.argv);
    var http_server = parseBool(args.http_server || process.env.HTTP_SERVER || settings.http_server || true), https_server = parseBool(args.https_server || process.env.HTTPS_SERVER || settings.https_server || false), use_socket_io = parseBool(args.use_socket_io || process.env.USE_SOCKET_IO || settings.use_socket_io || true);
    var sslserver, server;
    // HTTPS Server
    if (https_server) {
        // HTTPS Settings
        var sslIp_1 = args.https_ip || process.env.HTTPS_IP || settings.https_ip || '0.0.0.0';
        var sslPort_1 = normalizePort(args.https_port || process.env.HTTPS_PORT || settings.https_port || 3443);
        var sslCert = {
            key: fs_1.readFileSync(args.https_key || process.env.HTTPS_KEY || settings.https_key),
            cert: fs_1.readFileSync(args.https_cert || process.env.HTTPS_CERT || settings.https_cert)
        };
        app.set('sslport', sslPort_1);
        app.set('sslip', sslIp_1);
        // Start SSL Server
        sslserver = https_1.createServer(sslCert, app);
        sslserver.listen(sslPort_1, sslIp_1, function () {
            console.log('Created Listener on https://' + sslIp_1 + ':' + sslPort_1);
        });
        sslserver.on('error', function (err) { return onError(err, sslPort_1); });
        sslserver.on('listening', function () { return onListening(sslserver.address()); });
    }
    if (http_server) {
        // Start HTTP if SSL isn't active or on non-conflicting ports
        var ip_1 = args.ip || process.env.IP || process.env.IP || settings.http_ip || '0.0.0.0';
        var port_1 = normalizePort(args.port || process.env.PORT || process.env.PORT || settings.http_port || 3080);
        app.set('port', port_1);
        app.set('ip', ip_1);
        server = http_1.createServer(app);
        server.listen(port_1, ip_1, function () {
            console.log('Created Listener on http://' + ip_1 + ':' + port_1);
        });
        server.on('connect', function () { return onConnection(); });
        server.on('connection', function () { return onConnection(); });
        server.on('error', function (err) { return onError(err, port_1); });
        server.on('listening', function () { return onListening(server.address()); });
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
    process.on('SIGINT', function () {
        process.exit(0);
    });
    // Clean up from running processes
    process.on('exit', function () {
        console.log('\nShutting Down..\n');
    });
    return { sslserver: sslserver, server: server };
}
exports.API = API;
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
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
    if (str == null) {
        return false;
    }
    if (typeof str === 'boolean') {
        return (str === true);
    }
    if (typeof str === 'string' && str === '') {
        return false;
    }
    else if (typeof str === 'string') {
        str = str.replace(/^\s+|\s+$/g, '');
        if (str.toLowerCase() === 'true' || str.toLowerCase() === 'yes') {
            return true;
        }
        str = str.replace(/,/g, '.');
        str = str.replace(/^\s*\-\s*/g, '-');
    }
    if (!isNaN(str)) {
        return (parseFloat(str) !== 0);
    }
    return false;
}
/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error, port) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
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
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
/**
 * Event listen for HTTP Connections
 */
function onConnection() { }


/***/ }),

/***/ "./src/api/api-socket-io.ts":
/*!**********************************!*\
  !*** ./src/api/api-socket-io.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _this = this;
// IO Integration
var socketIO = __webpack_require__(/*! socket.io */ "socket.io");
var SocketIOModule = (function () {
    _this.io = null;
    _this.init = function (sslserver, server) {
        this.io = new socketIO();
        if (sslserver) {
            this.io.attach(sslserver);
        }
        if (server) {
            this.io.attach(server);
        }
    };
    return _this;
})();
module.exports = SocketIOModule;


/***/ }),

/***/ "./src/api/api.ts":
/*!************************!*\
  !*** ./src/api/api.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(/*! express */ "express");
var api_ctrl_1 = __webpack_require__(/*! ./api-ctrl */ "./src/api/api-ctrl.ts");
var apiSettings = {
    http_port: 6193,
    app_folder: '../web',
    bodyparserJson: {},
    bodyparserUrlencoded: { extended: true },
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
var app = express();
// Preconfiguation of express app
// apiDotSettings is the updated config version that includes info from .env
var apiDotSettings = api_ctrl_1.APIConfig(app, apiSettings);
// import modules
var SysinfoRoutes = __webpack_require__(/*! ../modules/sysinfo/api */ "./src/modules/sysinfo/api/index.ts");
app.use(SysinfoRoutes);
var SpotifyModule = __webpack_require__(/*! ../modules/spotify/api */ "./src/modules/spotify/api/index.ts");
app.use(SpotifyModule);
// serve static files from app_folder (default: ../web)
app.get('*.*', express.static(apiDotSettings.app_folder, { maxAge: '1y' }));
// server any application path from app_folder (default: ../web)
app.all('*', function (req, res) {
    console.log(req.url, req.method);
    res.status(200).sendFile("/", { root: apiDotSettings.app_folder });
});
// Setup API Listener
var _a = api_ctrl_1.API(app, apiDotSettings), sslserver = _a.sslserver, server = _a.server;


/***/ }),

/***/ "./src/modules/db.ts":
/*!***************************!*\
  !*** ./src/modules/db.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Knex = __webpack_require__(/*! knex */ "knex");
var DB = /** @class */ (function () {
    function DB() {
    }
    DB.startup = function () {
        var dbConfig = DB.knexConfig;
        var k = Knex(dbConfig);
        return k;
    };
    DB.knexConfig = {
        client: 'sqlite3',
        connection: {
            filename: './rpi-webapp.db'
        },
        useNullAsDefault: true
    };
    DB.knex = DB.startup();
    return DB;
}());
exports.DB = DB;


/***/ }),

/***/ "./src/modules/spotify/api/index.ts":
/*!******************************************!*\
  !*** ./src/modules/spotify/api/index.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var api_ctrl_1 = __webpack_require__(/*! ../../../api/api-ctrl */ "./src/api/api-ctrl.ts");
var path_1 = __webpack_require__(/*! path */ "path");
var express = __webpack_require__(/*! express */ "express");
var router = express.Router({ mergeParams: true });
api_ctrl_1.parseDotEnv(path_1.join(__dirname, './modules/spotify/api/.env'));
var SpotifyAuthRoutes = __webpack_require__(/*! ../api/spotify-auth.routes */ "./src/modules/spotify/api/spotify-auth.routes.ts");
router.use(SpotifyAuthRoutes);
var SpotifyRoutes = __webpack_require__(/*! ../api/spotify.routes */ "./src/modules/spotify/api/spotify.routes.ts");
router.use(SpotifyRoutes);
module.exports = router;


/***/ }),

/***/ "./src/modules/spotify/api/spotify-auth.ctrl.ts":
/*!******************************************************!*\
  !*** ./src/modules/spotify/api/spotify-auth.ctrl.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var urljoin = __webpack_require__(/*! url-join */ "url-join");
var request = __webpack_require__(/*! request */ "request");
var shortid = __webpack_require__(/*! shortid */ "shortid");
var db_1 = __webpack_require__(/*! ../../db */ "./src/modules/db.ts");
var default_shortid_chars = 'CDEPQMtuvw56cd~1eFG2WXYZab.iABsklxyRnNOfgh4oH3IJjm78_pqrzL90STUV', shortid_chars = process.env.SHORTID_CHARS || default_shortid_chars, shortid_removewords = process.env.SHORTID_REMOVEWORDS || 'fuck';
// Error checking shortid charactor set length is valid
try {
    shortid.characters(shortid_chars);
}
catch (e) {
    console.log('Invalid Short ID Charactors:', e.message);
    console.log('Invalid Set:', shortid_chars);
    console.log('Reverting Short ID to Default Charset');
    shortid.characters(default_shortid_chars);
}
var spotify_auth_url = 'https://accounts.spotify.com/authorize';
var searchWords = shortid_removewords;
var searchExp = new RegExp(searchWords.split(',').join('|'), 'gi');
function getAuth(state, uri) {
    return __awaiter(this, void 0, void 0, function () {
        var authRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_1.DB.knex('spotify_auth').
                            select('spotify_auth.*').
                            where('token_state_auth', state).
                            first().
                            catch(function (err) {
                            throw err;
                        })];
                case 1:
                    authRecord = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!(!authRecord && uri)) return [3 /*break*/, 4];
                    return [4 /*yield*/, db_1.DB.knex('spotify_me').
                            leftJoin('spotify_auth', 'spotify_auth.me_id', 'spotify_me.id').
                            select('spotify_auth.*').
                            where('spotify_auth.uri', uri).
                            orderBy('spotify_auth.token_expires', 'DESC').
                            first().
                            catch(function (err) {
                            throw err;
                        })];
                case 3:
                    authRecord = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(!authRecord && !state && !uri)) return [3 /*break*/, 6];
                    return [4 /*yield*/, db_1.DB.knex('spotify_me').
                            leftJoin('spotify_auth', 'spotify_auth.me_id', 'spotify_me.id').
                            select('spotify_auth.*').
                            orderBy('spotify_auth.token_expires', 'DESC').
                            first().
                            catch(function (err) {
                            throw err;
                        })];
                case 5:
                    authRecord = _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, authRecord];
            }
        });
    });
}
exports.getAuth = getAuth;
function initAuthUrl(host) {
    return __awaiter(this, void 0, void 0, function () {
        var spotify_keys, state, spotify_redirect, spotify_auth_scope;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.DB.knex('spotify_keys').select('*').orderBy('id', 'DESC').first()];
                case 1:
                    spotify_keys = _a.sent();
                    state = createStateAuth();
                    spotify_redirect = urljoin(host, '/api/spotify/callback');
                    spotify_auth_scope = 'user-library-read user-library-modify user-read-playback-state ' +
                        'user-read-currently-playing user-read-recently-played user-modify-playback-state ' +
                        'playlist-read-collaborative playlist-modify-private playlist-modify-public ' +
                        'playlist-read-private user-top-read user-follow-read user-follow-modify';
                    return [4 /*yield*/, db_1.DB.knex('spotify_auth').insert({
                            client_id: spotify_keys.spotify_client_id,
                            token_scope: spotify_auth_scope,
                            redirect_uri: spotify_redirect,
                            token_state_auth: state
                        })];
                case 2:
                    _a.sent();
                    // Redirect to URL
                    return [2 /*return*/, spotify_auth_url +
                            '?client_id=' + encodeURIComponent(spotify_keys.spotify_client_id) +
                            '&response_type=code' +
                            '&redirect_uri=' + encodeURIComponent(spotify_redirect) +
                            '&scope=' + encodeURIComponent(spotify_auth_scope) +
                            '&state=' + encodeURIComponent(state) +
                            '&show_dialog=true'];
            }
        });
    });
}
exports.initAuthUrl = initAuthUrl;
function initAuthCallback(state, code) {
    var _this = this;
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var dbToken, tokenResp, userInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.DB.knex('spotify_auth').select('*').where('token_state_auth', state).first()];
                case 1:
                    dbToken = _a.sent();
                    return [4 /*yield*/, fetchAuthToken(state, {
                            grant_type: 'authorization_code',
                            code: code,
                            redirect_uri: dbToken.redirect_uri
                        }).catch(function (err) { return rej(err); })];
                case 2:
                    tokenResp = _a.sent();
                    if (!tokenResp) return [3 /*break*/, 7];
                    return [4 /*yield*/, refreshUserInfo(state).catch(function (err) { return rej(err); })];
                case 3:
                    userInfo = _a.sent();
                    if (!userInfo) return [3 /*break*/, 5];
                    // Update auth record with user id
                    return [4 /*yield*/, db_1.DB.knex('spotify_auth').update({
                            me_id: userInfo[1]
                        }).where('token_state_auth', state).catch(function (err) {
                            console.log('Error, Me ID Update!', err);
                        })];
                case 4:
                    // Update auth record with user id
                    _a.sent();
                    // Redirect to spotify page
                    res(userInfo);
                    return [3 /*break*/, 6];
                case 5:
                    rej({ status: 400, error: 'Unable to fetch user information' });
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    rej({ status: 404, error: 'No Auth Initalized' });
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); });
}
exports.initAuthCallback = initAuthCallback;
function createStateAuth() {
    var ret = shortid.generate();
    while (shortid_removewords && searchExp.test(ret)) {
        ret = shortid.generate();
    }
    return ret;
}
exports.createStateAuth = createStateAuth;
// Update Auth Token from https://accounts.spotify.com/api/token
function updateAuthToken(state, body) {
    // Add Access Token to Auth Record
    var newAuthInfo = {
        access_token: body.access_token || '',
        token_type: body.token_type || '',
        token_expires: Math.round((new Date().getTime()) + ((body.expires_in || 3600) * 1000))
    };
    if (body.refresh_token) {
        newAuthInfo.refresh_token = body.refresh_token;
    }
    return db_1.DB.knex('spotify_auth').update(newAuthInfo).
        where('token_state_auth', state).catch(function (err) {
        console.log('Update Auth Token Error!', err);
    });
}
exports.updateAuthToken = updateAuthToken;
function refreshUserInfo(state) {
    var _this = this;
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var dbToken;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.DB.knex('spotify_auth').select('*').where('token_state_auth', state).first()];
                case 1:
                    dbToken = _a.sent();
                    // use the access token to access the Spotify Web API
                    request.get({
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + dbToken.access_token },
                        json: true
                    }, function (errMe, respMe, bodyMe) { return __awaiter(_this, void 0, void 0, function () {
                        var meURI, me, meId;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!errMe) return [3 /*break*/, 1];
                                    rej({ status: 400, error: errMe });
                                    return [3 /*break*/, 8];
                                case 1:
                                    if (!(!errMe && respMe.statusCode === 200)) return [3 /*break*/, 7];
                                    meURI = bodyMe.uri || '';
                                    return [4 /*yield*/, db_1.DB.knex('spotify_me').select('id').where('uri', meURI).first()];
                                case 2:
                                    me = _a.sent();
                                    if (!!me) return [3 /*break*/, 4];
                                    return [4 /*yield*/, db_1.DB.knex('spotify_me').insert({
                                            uri: meURI,
                                            name: bodyMe.display_name || '',
                                            me_type: bodyMe.type || '',
                                            me_json: JSON.stringify(bodyMe)
                                        }).catch(function (err) {
                                            console.log('Error, Inserting Me!', err);
                                        })
                                        // assign new id
                                    ];
                                case 3:
                                    meId = _a.sent();
                                    // assign new id
                                    me = { id: meId[0] };
                                    return [3 /*break*/, 6];
                                case 4: 
                                // Update with new info
                                return [4 /*yield*/, db_1.DB.knex('spotify_me').update({
                                        name: bodyMe.display_name || '',
                                        me_type: bodyMe.type || '',
                                        me_json: JSON.stringify(bodyMe)
                                    }).where('id', me.id).catch(function (err) {
                                        console.log('Error, Updating Me!', err);
                                    })];
                                case 5:
                                    // Update with new info
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
                                    res(me.id);
                                    return [3 /*break*/, 8];
                                case 7:
                                    rej({ status: respMe.statusCode, error: 'Unknown Response Status' });
                                    _a.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.refreshUserInfo = refreshUserInfo;
function refreshAuthToken(state) {
    return __awaiter(this, void 0, void 0, function () {
        var dbToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.DB.knex('spotify_auth').select('*').where('token_state_auth', state).first()];
                case 1:
                    dbToken = _a.sent();
                    if (!dbToken.refresh_token) {
                        return [2 /*return*/, Promise.reject({ status: 404, error: 'No Refresh Token' })];
                    }
                    return [2 /*return*/, fetchAuthToken(state, {
                            grant_type: 'refresh_token',
                            refresh_token: dbToken.refresh_token
                        })];
            }
        });
    });
}
exports.refreshAuthToken = refreshAuthToken;
function fetchAuthToken(state, formData) {
    var _this = this;
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var spotify_keys;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.DB.knex('spotify_keys').select('*').orderBy('id', 'DESC').first()];
                case 1:
                    spotify_keys = _a.sent();
                    // Get Record by State
                    request.post('https://accounts.spotify.com/api/token', {
                        auth: {
                            'user': spotify_keys.spotify_client_id,
                            'pass': spotify_keys.spotify_client_secret
                        },
                        form: formData,
                        json: true
                    }, function (err, httpResponse, body) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!err) return [3 /*break*/, 1];
                                    rej({ status: 500, error: 'Token Request Error' });
                                    return [3 /*break*/, 4];
                                case 1:
                                    if (!(!err && httpResponse.statusCode === 200)) return [3 /*break*/, 3];
                                    // update database
                                    return [4 /*yield*/, updateAuthToken(state, body)];
                                case 2:
                                    // update database
                                    _a.sent();
                                    res(body);
                                    return [3 /*break*/, 4];
                                case 3:
                                    rej({ status: 400, error: body });
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.fetchAuthToken = fetchAuthToken;
function saveKeys(client_id, client_secret) {
    return __awaiter(this, void 0, void 0, function () {
        var spotify_keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.DB.knex('spotify_keys').select('*').
                        where('spotify_client_id', client_id)];
                case 1:
                    spotify_keys = _a.sent();
                    if (spotify_keys.length) {
                        return [2 /*return*/, db_1.DB.knex('spotify_keys').update({
                                'spotify_client_secret': client_secret
                            }).where('spotify_client_id', client_id)];
                    }
                    else {
                        return [2 /*return*/, db_1.DB.knex('spotify_keys').insert({
                                'spotify_client_id': client_id,
                                'spotify_client_secret': client_secret
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.saveKeys = saveKeys;
function createDBTables() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.DB.knex.raw("\n    CREATE TABLE IF NOT EXISTS \"spotify_auth\" (\n      \"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\n      \"me_id\" INTEGER,\n      \"client_id\" TEXT,\n      \"token_type\" TEXT,\n      \"access_token\" TEXT,\n      \"refresh_token\" TEXT,\n      \"token_expires\" INTEGER,\n      \"token_scope\" TEXT,\n      \"redirect_uri\" TEXT,\n      \"token_state_auth\" TEXT\n    )\n  ")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.DB.knex.raw("\n    CREATE TABLE IF NOT EXISTS \"spotify_me\" (\n      \"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\n      \"uri\" TEXT,\n      \"name\" TEXT,\n      \"me_type\" TEXT,\n      \"me_json\" TEXT\n    );\n  ")];
                case 2:
                    _a.sent();
                    return [2 /*return*/, db_1.DB.knex.raw("\n    CREATE TABLE IF NOT EXISTS \"spotify_keys\" (\n      \"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\n      \"spotify_client_id\" TEXT,\n      \"spotify_client_secret\" TEXT\n    );\n  ")];
            }
        });
    });
}
exports.createDBTables = createDBTables;


/***/ }),

/***/ "./src/modules/spotify/api/spotify-auth.routes.ts":
/*!********************************************************!*\
  !*** ./src/modules/spotify/api/spotify-auth.routes.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express_1 = __webpack_require__(/*! express */ "express");
var SpotifyAuthCtrl = __webpack_require__(/*! ./spotify-auth.ctrl */ "./src/modules/spotify/api/spotify-auth.ctrl.ts");
var urljoin = __webpack_require__(/*! url-join */ "url-join");
var router = express_1.Router();
router.put('/api/spotify/developer_keys', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var body, client_id, client_secret;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body || {}, client_id = body.client_id || '', client_secret = body.client_secret || '';
                return [4 /*yield*/, SpotifyAuthCtrl.createDBTables()];
            case 1:
                _a.sent();
                SpotifyAuthCtrl.saveKeys(client_id, client_secret).then(function (tokenResp) {
                    res.status(201).json(tokenResp);
                }).catch(function (err) {
                    console.log(err);
                    res.status((err.status || 400)).json(err.error);
                });
                return [2 /*return*/];
        }
    });
}); });
router.get('/api/spotify/auth', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var spotify_authorize_url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Check DB Tables are created
            return [4 /*yield*/, SpotifyAuthCtrl.createDBTables()];
            case 1:
                // Check DB Tables are created
                _a.sent();
                spotify_authorize_url = SpotifyAuthCtrl.initAuthUrl(urljoin(req.protocol + '://' + req.headers.host));
                // Start browser journey
                res.redirect(spotify_authorize_url);
                return [2 /*return*/];
        }
    });
}); });
router.put('/api/spotify/refresh/:state', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var params, state;
    return __generator(this, function (_a) {
        params = req.params || {}, state = params.state || '';
        if (!state) {
            res.status(400).end();
        }
        SpotifyAuthCtrl.refreshAuthToken(state).then(function (tokenResp) {
            res.status(201).json(tokenResp);
        }).catch(function (err) {
            res.status(err.status).json(err.error);
        });
        return [2 /*return*/];
    });
}); });
router.get('/api/spotify/callback', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var query, code, state;
    return __generator(this, function (_a) {
        query = req.query || {}, code = query.code || '', state = query.state || '';
        SpotifyAuthCtrl.initAuthCallback(state, code).then(function (userInfo) {
            res.redirect('/#/spotify');
        }).catch(function (err) {
            res.status(err.status).send(err.error);
        });
        return [2 /*return*/];
    });
}); });
module.exports = router;


/***/ }),

/***/ "./src/modules/spotify/api/spotify-wrapper.ts":
/*!****************************************************!*\
  !*** ./src/modules/spotify/api/spotify-wrapper.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var urljoin = __webpack_require__(/*! url-join */ "url-join");
var request = __webpack_require__(/*! request */ "request");
var SpotifyAuthCtrl = __webpack_require__(/*! ./spotify-auth.ctrl */ "./src/modules/spotify/api/spotify-auth.ctrl.ts");
function makeSpotifyCall(callType, url, query, token, body) {
    if (body === void 0) { body = null; }
    return new Promise(function (res, rej) {
        var opts = {
            url: urljoin('https://api.spotify.com/', url),
            qs: query,
            headers: { 'Authorization': 'Bearer ' + token },
            json: true
        };
        if (callType.toLocaleLowerCase() !== 'get' && body !== null) {
            opts.body = body;
        }
        // console.log(callType, opts);
        request[callType.toLocaleLowerCase()](opts, function (errMe, respMe, bodyMe) {
            if (errMe) {
                rej({ status: 400, error: errMe });
            }
            else {
                res({ http: respMe, body: bodyMe });
            }
        });
    }).catch(function (err) {
        throw err;
    });
}
function default_1(callType, url, query, body) {
    return __awaiter(this, void 0, void 0, function () {
        var uri, state, callTypeLC, authRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = query.uri || '', state = query.state || '';
                    callTypeLC = callType.toLocaleLowerCase();
                    return [4 /*yield*/, SpotifyAuthCtrl.getAuth(state, uri).catch(function (err) { return console.log('Auth Error', err); })];
                case 1:
                    authRecord = _a.sent();
                    if (!(authRecord.token_expires < ((new Date().getTime()) + 120000))) return [3 /*break*/, 3];
                    return [4 /*yield*/, SpotifyAuthCtrl.refreshAuthToken(authRecord.token_state_auth).catch(function (err) {
                            return Promise.reject({ status: 400, error: 'Token Renewal Required' });
                        })];
                case 2:
                    authRecord = _a.sent();
                    _a.label = 3;
                case 3:
                    // Filter Query
                    query = Object.keys(query)
                        .filter(function (k) { return (k !== 'state' && k !== 'uri'); })
                        .reduce(function (q, k) { return (q[k] = query[k], q); }, {});
                    if (authRecord) {
                        return [2 /*return*/, makeSpotifyCall(callTypeLC, url, query, authRecord.access_token, body)];
                    }
                    else {
                        return [2 /*return*/, Promise.reject({ status: 400, error: 'No Authorization Available' })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;


/***/ }),

/***/ "./src/modules/spotify/api/spotify.routes.ts":
/*!***************************************************!*\
  !*** ./src/modules/spotify/api/spotify.routes.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express_1 = __webpack_require__(/*! express */ "express");
var urljoin = __webpack_require__(/*! url-join */ "url-join");
var spotify_wrapper_1 = __webpack_require__(/*! ./spotify-wrapper */ "./src/modules/spotify/api/spotify-wrapper.ts");
var SocketIOModule = __webpack_require__(/*! ../../../api/api-socket-io */ "./src/api/api-socket-io.ts");
var router = express_1.Router();
router.post('/api/spotify/raspotify/event', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        SocketIOModule.io.emit('spotify', {});
        res.status(204).end();
        return [2 /*return*/];
    });
}); });
router.all('/api/spotify/v1/:me*', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, me, meStar, query, body;
    return __generator(this, function (_a) {
        params = req.params || {}, me = params.me || '', meStar = params[0] || '', query = req.query || {}, body = ((req.method || '').toLocaleLowerCase() === 'get') ? null : req.body;
        spotify_wrapper_1.default(req.method, urljoin('v1/', me, meStar), query, body).then(function (result) {
            // Reply Status, Body
            res.status(((result.http || {}).statusCode || 200)).json((result.body || {}));
        }).catch(function (err) {
            // Catch Errors with status 400 default
            res.status((err.status || 400));
            if (typeof err.error === 'object') {
                res.json(err.error);
            }
            else {
                res.send(err.error);
            }
        });
        return [2 /*return*/];
    });
}); });
module.exports = router;


/***/ }),

/***/ "./src/modules/sysinfo/api/index.ts":
/*!******************************************!*\
  !*** ./src/modules/sysinfo/api/index.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var express = __webpack_require__(/*! express */ "express");
var router = express.Router({ mergeParams: true });
var SysinfoRoutes = __webpack_require__(/*! ./sysinfo.routes */ "./src/modules/sysinfo/api/sysinfo.routes.ts");
router.use(SysinfoRoutes);
module.exports = router;


/***/ }),

/***/ "./src/modules/sysinfo/api/sysinfo.routes.ts":
/*!***************************************************!*\
  !*** ./src/modules/sysinfo/api/sysinfo.routes.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var express_1 = __webpack_require__(/*! express */ "express");
var si = __webpack_require__(/*! systeminformation */ "systeminformation");
var router = express_1.Router();
router.get('/api/sysinfo/static', function (req, res) {
    Promise.all([
        si.system(),
        si.cpu(),
        si.cpuFlags()
    ]).then(function (data) {
        res.status(200).json({
            system: data[0],
            cpu: data[1],
            cpuFlags: data[2]
        });
    }).catch(function (error) { return console.error(error); });
});
router.get('/api/sysinfo/os', function (req, res) {
    Promise.all([
        si.osInfo(),
        si.versions(),
    ]).then(function (data) {
        res.status(200).json({
            osInfo: data[0],
            version: data[1]
        });
    }).catch(function (error) { return console.error(error); });
});
router.get('/api/sysinfo/cpu', function (req, res) {
    Promise.all([
        si.currentLoad(),
        si.fullLoad(),
        si.cpuCurrentspeed(),
        si.cpuTemperature()
    ]).then(function (data) {
        res.status(200).json({
            currentLoad: data[0],
            fullLoad: data[1],
            cpuCurrentspeed: data[2],
            cpuTemperature: data[3]
        });
    }).catch(function (error) { return console.error(error); });
});
router.get('/api/sysinfo/network', function (req, res) {
    Promise.all([
        si.networkInterfaces()
    ]).then(function (data) {
        res.status(200).json({
            networkInterfaces: data[0]
        });
    }).catch(function (error) { return console.error(error); });
});
router.get('/api/sysinfo/memory', function (req, res) {
    Promise.all([
        si.mem()
    ]).then(function (data) {
        res.status(200).json({
            mem: data[0]
        });
    }).catch(function (error) { return console.error(error); });
});
router.get('/api/sysinfo/disk', function (req, res) {
    Promise.all([
        si.fsSize(),
        si.diskLayout(),
        si.blockDevices()
    ]).then(function (data) {
        res.status(200).json({
            fsSize: data[0],
            diskLayout: data[1],
            blockDevices: data[2]
        });
    }).catch(function (error) { return console.error(error); });
});
router.get('/api/sysinfo/processes', function (req, res) {
    Promise.all([
        si.processes(),
        si.services('*')
    ]).then(function (data) {
        res.status(200).json({
            processes: data[0],
            services: data[1]
        });
    }).catch(function (error) { return console.error(error); });
});
router.get('/api/sysinfo/wifi', function (req, res) {
    Promise.all([
        si.wifiNetworks
    ]).then(function (data) {
        res.status(200).json({
            wifi: data[0]
        });
    }).catch(function (error) { return console.error(error); });
});
router.get('/api/sysinfo/all', function (req, res) {
    Promise.all([
        si.getStaticData(),
        si.getDynamicData('', '')
    ]).then(function (data) {
        res.status(200).json({
            static: data[0],
            dynamic: data[1]
        });
    }).catch(function (error) { return console.error(error); });
});
module.exports = router;


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "easy-rbac":
/*!****************************!*\
  !*** external "easy-rbac" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("easy-rbac");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "knex":
/*!***********************!*\
  !*** external "knex" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("knex");

/***/ }),

/***/ "minimist":
/*!***************************!*\
  !*** external "minimist" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("minimist");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "shortid":
/*!**************************!*\
  !*** external "shortid" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("shortid");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),

/***/ "systeminformation":
/*!************************************!*\
  !*** external "systeminformation" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("systeminformation");

/***/ }),

/***/ "url-join":
/*!***************************!*\
  !*** external "url-join" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url-join");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map