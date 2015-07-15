// TODO config stuff
var express = require('express');

var session = require('express-session')({
  secret: 'sample-secret',
  resave: false,
  saveUninitialized: false
});

var r = express.Router();
r.use(session);
r.get('/dump_session', function (req, res, next) {
  res.header('Content-type', 'text/plain');
  res.send(JSON.stringify(req.session, null, '  '));
});

module.exports = r;
