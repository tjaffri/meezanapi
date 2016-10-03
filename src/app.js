/* eslint-disable no-use-before-define */

/**
 * meezanapi
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import config from './config.json';
import server from './server';
import http from 'http';

const debug = require('debug')('meezanapi:app');

/**
 * Create HTTP server.
 */
const port = normalizePort(process.env.PORT || config.port);
server.set('port', port);
const serverInstance = http.createServer(server);

/**
 * Listen on provided port, on all network interfaces.
 */

serverInstance.listen(port);
serverInstance.on('error', onError);
serverInstance.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const normalizedPort = parseInt(val, 10);

  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `pipe ${port}`
    : `port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = serverInstance.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

export default serverInstance;
