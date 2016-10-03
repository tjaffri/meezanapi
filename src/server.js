/**
 * meezan-api
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import routes from './routes/index';
import chapters from './routes/chapters';
import juz from './routes/juz';

const debug = require('debug')('meezan-api:server');
const server = express();

// View engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

// Middleware setup
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

// Set up routes
server.use('/', routes);
server.use('/chapters', chapters);
server.use('/juz', juz);

// Catch 404 and forward to error handler
server.use(async (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers and logging.
if (server.get('env') === 'development') {
  // Dev logging is verbose, with color coding.
  debug('Enabling dev logging');
  server.use(logger('dev'));
  // Development error handler will print stacktrace.
  debug('Enabling error handler with stack traces.');
  server.use(async (err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
} else {
  // Production mode logging is concise, with minimal information.
  debug('Enabling production logging');
  server.use(logger('tiny'));
  // Production error handler does not print/leak stacktraces.
  debug('Enabling production error handler with no stack traces.');
  server.use(async (err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
    });
  });
}

export default server;
