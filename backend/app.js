var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var randomSongRouter = require('./routes/randomSong');
var githubRouter = require('./routes/github');

require('dotenv').config();
var app = express();
app.use(cors());
var SpotifyWebApi = require('spotify-web-api-node');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var clientId = process.env.SPOT_ID,
  clientSecret = process.env.SPOT_SECRET;
var redirect_uri = 'localhost:8888';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

let expires_at;



spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    let d = new Date();
    console.log("now: ", d);
    expires_at = new Date(d.setHours((d.getHours() + 1)));

    console.log("Expires at: ", expires_at)
    console.log(data.body);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);

// middleware for sending spotify object to routes as needed

app.use((req, res, next) => {
  req.spotify = spotifyApi;
  const d1 = new Date();
  // refresh token as needed
  if (d1.getTime() >= expires_at.getTime() ){
    spotifyApi.refreshAccessToken().then(
      function(data) {
        console.log('The access token has been refreshed!');
    
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
      },
      function(err) {
        console.log('Could not refresh access token', err);
      }
    );
  }
  //spotify token check on any route
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter)
app.use('/random', randomSongRouter);
app.use('/markdown', githubRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;
