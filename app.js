
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var mongoose = require('mongoose');
//added for partials
var partials = require('express-partials');
var index = require('./routes/index');
var login = require('./routes/login');
var games = require('./routes/games');
var user = require('./routes/user');
var search = require('./routes/search');
var assignment = require('./routes/assignment');
var confirmation = require('./routes/confirmation');
var prompt = require('./routes/prompt');
var round_complete = require('./routes/round_complete');
var verification = require('./routes/verification');


var app = express();

var local_database_name = 'cliq_db';
var local_database_uri  = 'mongodb://localhost/' + local_database_name;
var database_uri = process.env.MONGOLAB_URI || local_database_uri;
mongoose.connect(database_uri);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//added for partials
app.use(partials());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
//app.get('/nw-home', index.viewNewUserAlternate);
app.get('/login', login.view);
app.get('/logout', login.logout);
// app.get('/matches', matches.view);
app.get('/search', search.view);
app.get('/assignment', assignment.view);
app.get('/confirmation', confirmation.view);
app.get('/get_classes_query', search.get_classes_from_query);


app.get('/new_game', games.view);

app.get('/new-profile', user.create_new_profile);
app.get('/update-profile', user.render_update_profile);

// for prompt page
app.get('/prompt', prompt.view);

// for end of round page
app.get('/round_complete', round_complete.view);

app.post('/post-login', user.login_or_signup);
app.post('/post-create-profile', user.handle_create_profile);
app.post('/create_game', games.handle_create_game);
app.post('/verify-phone', user.handle_validation);
app.post('/post-update-profile', user.handle_update_profile);
app.post('/verification', verification.view);
app.post('/post-prompt', prompt.picture_taken);

// app.post('/post-update-match-request', matches.update_request);
// app.post('/post-create-match-request', matches.create_match_request);
// app.post('/delete-match-request', matches.delete_match_request);
// app.post('/delete-match', matches.delete_match);
// app.post('/edit-match-request', matches.edit_match_request);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





