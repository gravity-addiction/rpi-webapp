'use strict';

// IO Integration
const socketIO = require('socket.io');

const SocketIOModule = (() => {
  this.io = null;

  this.init = function(sslserver, server) {
    this.io = new socketIO();
    if (sslserver) { this.io.attach(sslserver); }
    if (server) { this.io.attach(server); }
  }

  return this;
})();

export = SocketIOModule;
