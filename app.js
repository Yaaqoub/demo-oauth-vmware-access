const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const pe = require('parse-error');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();



var app = express();

var ClientOAuth2 = require('client-oauth2');

var accessAuth = new ClientOAuth2({
  clientId: 'demo-nodejs',
  clientSecret: 'r3VCYSgRbqUVj0eMN7jGtIBvumpThaKo4z5fiNGyTgMvaL7V',
  accessTokenUri: 'https://td-yaaqoub-e6692.vidmpreview.com/SAAS/auth/oauthtoken',
  authorizationUri: 'https://td-yaaqoub-e6692.vidmpreview.com/SAAS/auth/oauth2/authorize',
  redirectUri: 'http://localhost:3000/callback',
  scopes: ['Email', 'Profile', 'User', 'OpenID']
});

// For BodyParser
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '200mb'
}));
app.use(bodyParser.json({ limit: '200mb' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

// The main page
app.get('/', function (req, res) {
  res.json({
    message: 'Demo App'
  });
});

// Auth route
app.get('/auth', function (req, res) {
  var uri = accessAuth.code.getUri();
  res.redirect(uri);
});

// Callback route
app.get('/callback', function (req, res) {
  accessAuth.code.getToken(req.originalUrl).then((user) => {
    res.json({
      token: user.accessToken,
      scope: user.scope,
      tokenType: user.tokenType,
      expires: user.expires,
      refreshToken: user.refreshToken
    });

  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  let errorMessage = {};
  errorMessage.message = err.message;
  errorMessage.error = req.app.get('env') === 'development' ? err : {};

  errorMessage.status = err.status || 500;

  res.json(errorMessage);
});

module.exports = app;

process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});
