var logger = require('../logger');

var express = require('express');
var session = require('../session');

module.exports = function (options) {
  var permissions = require('./permissions')(options);

  var router = express.Router();
  router.use(session);
  router.use(function (req, res, next) {
    permissions.getPermission(req, res, options.statisticsPermission, function (error, valid) {
      if (error) {
        error.status = 500;
        next(error);
      } else if (valid) {
        next();
      } else {
        res.status(403);
        res.render('oauthNotAuthorized', {
          logoutEndpoint: options.baseUrl + options.resetEndpoint
        });
      }
    });
  });
  return {
    control: router
  };
};
