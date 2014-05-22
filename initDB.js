/*
*/

var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'cliq_db';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri

mongoose.connect(database_uri);

// var joe = new models.User({
//       "username": "jrabbott",
//       "email" : "jrabbott@stanford.edu",
//       "password" : "1234",
//       "first_name" : "Joe", 
//       "last_name" : "Abbott",
//       "bio": "I really like hummus and pretzel chips.",
//       "phone_number" : "5555555555"    
//     });

// joe.save(function(err, joe) {
//   if (err) {
//     console.log("there was an error");
//     console.log(err);
//     return console.error(err);
//   }
//   // console.dir(thor);
// });


// Do the initialization here

// Step 1: load the JSON data
var users_json = require('./users.json');
var users_arr = users_json["users"];

// // Step 2: Remove all existing documents
models.User
  .find()
  .remove()
  .exec(onceClear); // callback to continue at

// // Step 3: load the data from the JSON file
function onceClear(err) {
  if(err) console.log(err);

  // loop over the projects, construct and save an object from each one
  // Note that we don't care what order these saves are happening in...
  var to_save_count = users_arr.length;
  for(var i=0; i<users_arr.length; i++) {
    var json = users_json[i];
    var user = new models.User(json);
    user.save(function(err, user) {
      if(err) console.log(err);
      to_save_count--;
      console.log(to_save_count + ' left to save');
      if(to_save_count <= 0) {
        console.log('DONE');
        // The script won't terminate until the 
        // connection to the database is closed
        mongoose.connection.close()
      }
    });
  }
}


