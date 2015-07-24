var express = require('express');
var logger = require('../logger');

module.exports = function (options) {
  var request = require('request').defaults({
    baseUrl: options.apiUrl,
    headers: {
      'User-agent': 'Kibana OAuth dev branch'
    },
    json: true
  });

  function _checkCache(session, permission) {
    if (!session.permissions) {
      session.permissions = {};
      return null;
    }
    if (session.permissions[permission] === undefined) {
      return null;
    }
    return session.permissions[permission];
  }

  function _getPermissionOauth(req, res, permission, callback) {
    // TODO parametrisation?
    // TODO If token expired, refresh
    if ( !req.session.oauthToken ) {
      res.redirect(options.baseUrl + options.authEndpoint);
      return;
    }

    var access_token = req.session.oauthToken.parsed.access_token ||
      req.session.oauthToken.token.access_token;

    request.get({
      url: '/permissions/' + permission + '?access_token=' + access_token
    }, function (error, response, body) {
      if (error) {
        callback(error);
        return;
      }
      var verified = body.permitted === true;
      callback(null, verified);
    });
  }

  function getPermission(req, res, permission, callback) {
    var cached = _checkCache(req.session, permission);
    if (cached === null) {
      _getPermissionOauth(req, res, permission, function (error, valid) {
        if (error) {
          callback(error, false);
        } else {
          req.session.permissions[permission] = valid;
          callback(null, valid);
        }
      });
    } else {
      callback(null, cached);
    }
  }

  return {
    getPermission: getPermission
  };
};
