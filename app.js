
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
var auth = require('./routes/auth');
var games = require('./routes/games');
var game_requests = require('./routes/game_requests');
var user = require('./routes/user');
var search = require('./routes/search');
var assignment = require('./routes/assignment');
var confirmation = require('./routes/confirmation');
var prompt = require('./routes/prompt');
var round_complete = require('./routes/round_complete');
var verification = require('./routes/verification');
var num_rounds = require('./routes/num_rounds.js');


var app = express();

// var local_database_name = 'cliq_db';
// var local_database_uri  = 'mongodb://localhost/' + local_database_name;
// var database_uri = process.env.MONGOLAB_URI || local_database_uri;
// mongoose.connect(database_uri);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('db', path.join(__dirname, 'db'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.multipart());
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
app.get('/', index.view); // SPLASH PAGE

app.get('/login', auth.view); // LOG IN BUTTON
app.post('/login_or_signup', auth.login_or_signup); //LOG IN BUTTON
app.get('/render_create_account', auth.render_create_account); // NEED AN ACCOUNT BUTTON
app.get('/logout', auth.logout); // LOGOUT BUTTON

app.post('/create_account', user.create_account);

// app.get('/matches', matches.view);
// app.get('/search', search.view);
// app.get('/assignment', assignment.view);
// app.get('/confirmation', confirmation.view);
// app.get('/get_classes_query', search.get_classes_from_query);


//app.get('/new_game', games.view);

//app.get('/pending', game_requests.view);


//app.get('/update-profile', user.render_update_profile);

// for prompt page
//app.get('/prompt', prompt.view);

// for end of round page
//app.get('/round_complete', round_complete.view);

//app.get('/num_rounds', num_rounds.view);
//app.post('/select_opponent', num_rounds.select_opponent);


// app.post('/post-create-profile', auth.handle_create_profile);
//app.post('/create_game', games.handle_create_game);
//app.post('/verify-phone', user.handle_validation);
//app.post('/post-update-profile', user.handle_update_profile);
//app.post('/verification', verification.view);
//app.post('/post-prompt', prompt.picture_taken);

 //redirect here after create_game page
//app.post('/resolve_request', game_requests.resolve_request);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





