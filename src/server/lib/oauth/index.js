// TODO read config options
var options = {};
// Module constants
options.authEndpoint = '/auth';
options.callbackEndpoint = '/callback';
options.baseUrl = '/oauth';
options.state = 'some state';
options.redirectUrl = '/debug/dump_session';

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

var client = require('./client')(options);
var access = require('./access')(options);
var express = require('express');

var namespacedRouter = express.Router();
namespacedRouter.use(options.baseUrl, client.routes);

module.exports = {
  routes: namespacedRouter,
  // access: access.middleware,
  getPermission: access.getPermission
};
