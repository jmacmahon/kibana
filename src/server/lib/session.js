var options = {};

var config = require('../config');

var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var configuredSession = session({
  store: new RedisStore({
    host: config.session.redis_host,
    port: config.session.redis_port,
    prefix: config.session.redis_prefix
  }),
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false
});

module.exports = configuredSession;
