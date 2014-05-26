var Mongoose = require('mongoose');


var UserSchema = new Mongoose.Schema({
	"id" : Number,
	"username": String,
	"email": String,
	"password": String,
	"first_name": String,
	"last_name": String,
	"bio": String,
	"phone_number": String,
	"auth_code" : String,
	"phone_validated" : Boolean
	"games" : [Number] // of Game IDs that the user is playing
});

var GameSchema = new Mongoose.Schema({
	"id" : Number,
	"game_over" : Boolean,
	"players" : 
	{
		"id" = String,
		"score" = Number
	},
	"current_round" : Number,
	"current_prompt" : String,
	"rounds" : [Number]	// of Round IDs
});

var RoundSchema = new Mongoose.Schema({
	"id" : Number,
	"game_id" : String,		// which game does it belong to?
	"prompt" : String,
	"date_started" : Date,
	"photos" : [Number]		// of Photo IDs
});

var PhotoSchema = new Mongoose.Schema({
	"id" : Number
	"round_id" : Number		// which round does it belong to?
	"user_id" : Number		// which user took it?
	"img" : 
	{
		"data": Buffer,
		"contentType" : String
	},
	"date_taken" : Date
});

var GameRequestSchema = new Mongoose.Schema({
	"id" : Number,
	"user_from_id" : Number,
	"user_to_id" : Number,
	"pending" : Boolean,
	"seen" : Boolean
})


exports.User = Mongoose.model('User', UserSchema);
exports.Game = Mongoose.model('Game', GameSchema);
exports.Round = Mongoose.model('Round', RoundSchema);
exports.Photo = Mongoose.model('Photo', PhotoSchema);
exports.GameRequest = Mongoose.model('GameRequest', GameRequestSchema);







