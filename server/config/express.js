/**
 * Express configuration
 */

'use strict';

const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const config = require('../../config');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');

/**
 *
 * @param app
 */
module.exports = function (app) {
  // render
  app.set('views', config.backend.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use(cors());
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(helmet());
  app.use(compression());

  if (config.backend.serverFrontend) {
    var staticPath = path.posix.join(config.frontend.assetsPublicPath, config.frontend.assetsSubDirectory);
    app.use(staticPath, express.static(path.join(config.backend.frontend, '/static')));
    app.use(staticPath, express.static(path.join(config.backend.frontend, '/public')))
  }
};
