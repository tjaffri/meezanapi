/**
 * meezanapi
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
import cors from 'cors';
import jwt from 'express-jwt';
import rsaValidation from 'auth0-api-jwt-rsa-validation';

import config from './config.json';
import indexView from './routes/index';
import chaptersApi from './routes/chapters';
import juzApi from './routes/juz';
import playHeadsApi from './routes/playHeads';

const debug = require('debug')('meezanapi:server');
const server = express();

// View engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

// Middleware setup
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));
server.use(cors());

// Auth setup (JWT) if not development
if (process.env.NODE_ENV !== 'development') {
  // debug('Enabling JSON Web Token Auth');
  // const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
  // const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

  // if (!AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET) {
  //   throw new Error('Auth0 Client ID or Client Secret ENV not set.');
  // }

  // const jwtCheck = jwt({
  //   secret: new Buffer(AUTH0_CLIENT_SECRET, 'base64'),
  //   audience: AUTH0_CLIENT_ID,
  // });

  debug('Enabling OAuth 2');
  const oAuthCheck = jwt({
    secret: rsaValidation(),
    algorithms: ['RS256'],
    issuer: config.auth0_issuer,
    audience: config.auth0_audience,
  });

  // server.use('/jwt', jwtCheck);
  server.use(oAuthCheck);
}

// Set up routes
server.use('/', indexView);
server.use('/chapters', chaptersApi);
server.use('/juz', juzApi);
server.use('/playHeads', playHeadsApi);

// Catch 404 and forward to error handler
server.use(async (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers and logging.
if (process.env.NODE_ENV === 'development') {
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
