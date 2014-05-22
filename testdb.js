  
var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'cliq_db';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri

mongoose.connect(database_uri);

  models.User
    .find()
    .exec(afterquery);

    function afterquery(err, res) {
      console.log(res);
    }

mongoose.connection.close()
