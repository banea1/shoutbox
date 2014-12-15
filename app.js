
/**
 * Module dependencies.
 */

var express = require('express')
  , register = require('./routes/register')
  , http = require('http')
  , path = require('path')
  , messages = require('./lib/messages')
  , login = require('./routes/login')
  , user = require('./lib/middleware/user')
  , entries = require('./routes/entries')
  , validate = require('./lib/middleware/validate')
  , page = require('./lib/middleware/page')
  , Entry = require('./lib/entry')
  , api = require('./routes/api');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/api', api.auth);
  app.use(user);
  app.use(messages);
  app.use(app.router);  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', page(Entry.count, 5), entries.list);

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/post', entries.form);
app.post('/post',
  validate.required('entry[title]'),
  validate.lengthAbove('entry[title]', 4),
  entries.submit);

app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
