var match_request = require("../match_request.json");
var courses = require("./courses.json");
var assignments = require("./assignments.json");
var matches = require("../matches.json");
var games = require("../db/games.json");
var user_data = require('../user_data.js');
var game_requests = require("../db/game_requests.json");
var game_data = require("../games_data.js");

exports.view = function(req, res, curr_user){
	var user_id = req.session.curr_user_id;
	var game_requests = game_data.get_game_requests_for_user(user_id);
	var has_game_requests = false;
	var num_game_requests = game_requests.length;
	if (game_requests.length != 0) {
		has_game_requests = true;
	}
	console.log(game_requests);

	res.render('pending', 
	  	{
	  		'title': 'Welcome Back',
	  		'curr_user': curr_user,
	      'username': req.session.username,
	      'has_game_requests' : has_game_requests,
	      'challenges' : game_requests,
	      'num_game_requests' : num_game_requests
	  	});
}

exports.resolve_request = function(req, res) {
	console.log(req.body);
	var challenge = exports.get_request_by_id(req.body.request_num); 
	console.log(challenge);
	if (req.body.decision == "accept") {
		game_data.accept_request(challenge);

		var first_id = challenge.user_from_id;
		var second_id = challenge.user_to_id;
		console.log(challenge.user_from_id);
		console.log(challenge.user_to_id);

		var newgame = {
      "id" : 0,
      "game_over" : false,
      "first_user_id": first_id,
      "second_user_id" : second_id,
      "first_user_score" : 0,
      "second_user_score" : 0,
      "round" : 1,
      "current_prompt" : "Take a selfie with the most handsome gentlemen near you!",
      "first_user_completion" : -1,
      "second_user_completion" : -1,
      "score_diff": 0,
      "curr_winning": -1,
      "new_prompt":1
    };

    games.games.push(newgame);
    game_requests.game_requests = [];


	}
	else {
		// games_data.reject_request();
		console.log("REQUEST REJECTED");
	}

	res.redirect("/");
}

exports.get_request_by_id = function(request_id) {
	console.log(request_id);
	var requests = game_requests['game_requests'];
	for (var i = 0; i < requests.length; i++) {
		console.log("I is equal to "+i);
		console.log(requests[i]);
		if (requests[i].id == request_id) {
			console.log(requests[i]);
			return requests[i];
		}
	}
}

exports.update_game_request = function(game_request) {
	var index = game_request.id;
	console.log("ADDING GAME REQUEST WITH ID "+index);
  game_requests.game_requests[index] = game_request;
}