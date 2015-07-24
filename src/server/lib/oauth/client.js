var logger = require('../logger');

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
      if (error) {
        error.status = 500;
        next(error);
        return;
      }
      var token = oauth2.accessToken.create(result);
      token.parsed = querystring.parse(token.token);

      req.session.oauthToken = token;

      res.redirect(options.redirectUrl);
    });
  });

  router.get(options.resetEndpoint, function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
  });

  return {
    routes: router
  };
};
