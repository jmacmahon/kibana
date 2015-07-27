var options = {};
// Module constants
options.authEndpoint = '/auth';
options.callbackEndpoint = '/callback';
options.baseUrl = '/oauth';
options.resetEndpoint = '/reset';
options.state = 'some state';
options.redirectUrl = '/';

var config = require('../../config');

// Options from config
options.externalUrl = config.external_url;
options.oauth2Params = {
  clientID: config.oauth.client_id,
  clientSecret: config.oauth.client_secret,
  site: config.oauth.site,
  tokenPath: config.oauth.token_path,
  authorizationPath: config.oauth.authorization_path
};
options.apiUrl = config.oauth.api_url;
options.scope = config.oauth.scope;
options.statisticsPermission = config.oauth.statistics_permission;
options.enabled = config.oauth.enabled;

if (!options.enabled) {
  module.exports = {
    routes: function (req, res, next) { next(); },
    control: function (req, res, next) { next(); },
    getPermission: function (req, res, permission, callback) { callback(null, true); }
  };
} else {
  var client = require('./client')(options);
  var permissions = require('./permissions')(options);
  var access = require('./access')(options);
  var express = require('express');
  var session = require('../session');

  var namespacedRouter = express.Router();
  namespacedRouter.use(options.baseUrl, session);
  namespacedRouter.use(options.baseUrl, client.routes);

  module.exports = {
    routes: namespacedRouter,
    control: access.control,
    getPermission: permissions.getPermission
  };
}
