var logger = require('../logger');

var express = require('express');

module.exports = function (options) {
  var permissions = require('./permissions')(options);

  if (!options.enabled) {
    return {
      control: function (req, res, next) { next(); }
    };
  }

  return {
    control: function (req, res, next) {
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
    }
  };
};
