var Mongoose = require('mongoose');


var UserSchema = new Mongoose.Schema({
  // fields are defined here
	"username": String,
	"email": String,
	"password": String,
	"first_name": String,
	"last_name": String,
	"bio": String,
	"phone_number": String
});

exports.User = Mongoose.model('User', UserSchema);