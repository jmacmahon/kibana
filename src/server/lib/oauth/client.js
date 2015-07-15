var logger = require('../logger');
var config = require('../../config');

var express = require('express');
var querystring = require('querystring');

module.exports = function (options) {
  var oauth2 = require('simple-oauth2')(options.oauth2Params);

  var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: options.externalUrl + options.baseUrl + options.callbackEndpoint,
    scope: options.scope,
    state: options.state
  });

  var router = express.Router();

  router.get(options.authEndpoint, function (req, res, next) {
    res.redirect(authorization_uri);
  });

  router.get(options.callbackEndpoint, function (req, res, next) {
    var code = req.query.code;

    oauth2.authCode.getToken({
      code: code,
      redirect_uri: options.externalUrl + options.baseUrl + options.callbackEndpoint
    }, function (error, result) {
      // TODO real error handling
      if (error) {
        logger.error('Access Token error', error.error);
        res.status(500);
        res.send('Access Token error.');
        return;
      }
      var token = oauth2.accessToken.create(result);
      token.parsed = querystring.parse(token.token);

      req.session.oauthToken = token;

      res.redirect(options.redirectUrl);
    });
  });

  return {
    routes: router
  };
};
