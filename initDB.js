/*
*/

var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'cliq_db';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri

mongoose.connect(database_uri);

// Do the initialization here

// USERS.JSON

// Step 1: load the JSON data
var users_json = require('./db/users.json');
var users_arr = users_json["users"];

// // Step 2: Remove all existing documents
models.User
  .find()
  .remove()
  .exec(onceClearUser); // callback to continue at

// // Step 3: load the data from the JSON file
function onceClearUser(err) {
  if(err) console.log(err);

  // loop over the projects, construct and save an object from each one
  // Note that we don't care what order these saves are happening in...
  var to_save_count = users_arr.length;
  for(var i=0; i<users_arr.length; i++) {
    var json = users_arr[i];
    var user = new models.User(json);
    user.save(function(err, user) {
      if(err) console.log(err);
      to_save_count--;
      console.log(to_save_count + ' left to save');
      if(to_save_count <= 0) {
        console.log('DONE with users table');
        // The script won't terminate until the 
        // connection to the database is closed
        // mongoose.connection.close()
      }
    });
  }
}

// GAMES.JSON

// Step 1: load the JSON data
var games_json = require('./db/games.json');
var games_arr = users_json["games"];

// // Step 2: Remove all existing documents
models.Game
  .find()
  .remove()
  .exec(onceClearGame); // callback to continue at

// // Step 3: load the data from the JSON file
function onceClearGame(err) {
  if(err) console.log(err);

  // loop over the projects, construct and save an object from each one
  // Note that we don't care what order these saves are happening in...
  var to_save_count = games_arr.length;
  for(var i=0; i<games_arr.length; i++) {
    var json = games_arr[i];
    var game = new models.Game(json);
    game.save(function(err, game) {
      if(err) console.log(err);
      to_save_count--;
      console.log(to_save_count + ' left to save');
      if(to_save_count <= 0) {
        console.log('DONE with games table');
        // The script won't terminate until the 
        // connection to the database is closed
        // mongoose.connection.close()
      }
    });
  }
}

// ERASE PHOTO TABLE
models.Photo
  .find()
  .remove()
  .exec(onceClearPhoto); // callback to continue at

function onceClearPhoto(err) {
  if(err) console.log(err);
}

// ERASE ROUND TABLE
models.Round
  .find()
  .remove()
  .exec(onceClearRound); // callback to continue at

function onceClearRound(err) {
  if(err) console.log(err);
}

// ERASE GAMEREQUESTS TABLE
models.GameRequest
  .find()
  .remove()
  .exec(onceClearGameRequest);

function onceClearGameRequest(err) {
  if(err) console.log(err);
}



