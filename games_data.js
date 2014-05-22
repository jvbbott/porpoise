var game_data = require('./db/games.json');
var user_data = require('./db/users.json');
var game_requests = require('./db/game_requests.json');
var user_data_controller = require('./user_data.js');
var game_requests_controller = require('./routes/game_requests.js');


var twilio = require("./node_modules/twilio/lib");

var accountSid = 'AC5d3a15045fe20ac3a87aa9072b114ab5'; 
var authToken = 'a71d5c5997988f8f277437722898ac89'; 
var client = require('twilio')(accountSid, authToken); 

exports.get_all_games = function() {
	return game_data['games'];
}

exports.get_current_games_for_user = function(curr_user_id) {
	var all_games = game_data['games'];
	var curr_games_for_user = new Array();
	for (var i = 0; i < all_games.length; i++) {
		if (all_games[i].first_user_id == curr_user_id || all_games[i].second_user_id == curr_user_id) {
			curr_games_for_user.push(all_games[i]);
		}
	}
	return curr_games_for_user;
}

exports.get_game_requests_for_user = function(curr_user_id) {
	var all_requests = game_requests['game_requests'];
	var unseen_requests = new Array();
	for (var i = 0; i < all_requests.length; i++) {
		if (all_requests[i].user_to_id == curr_user_id && all_requests[i].seen == false) {
			unseen_requests.push(all_requests[i]);
		}
	}
	return unseen_requests;

}

exports.create_game_request = function(user_1, user_2, user_1_info) {
	var new_request = exports.get_new_game_request_instance();
	new_request.id = game_requests.game_requests.length;
	new_request.user_from_id = user_1;
	new_request.user_to_id = user_2;
	new_request.user_from_first_name = user_1_info.first_name;
	new_request.user_from_last_name = user_1_info.last_name;
	game_requests_controller.update_game_request(new_request);
	console.log(new_request);
	return;
}

exports.accept_request = function(request) {
	var user_1_id = request.user_from_id;
	var user_2_id = request.user_to_id;
	var new_game = exports.get_new_game_instance();
	new_game.first_user_id = user_1_id;
	new_game.second_user_id = user_2_id;
	exports.update_game(new_game);


	var user_1_info = user_data_controller.get_user_by_id(user_1_id);
	var user_2_info = user_data_controller.get_user_by_id(user_2_id);
	client.messages.create({ 
        to: user_1_info.phone_number, 
        from: "+19562051565", 
        body: "New game created between you and "+user_2_info.first_name+"! Hurry and visit http://cliq.herokuapp.com to see your first prompt!",   
    }, function(err, message) { 
        console.log(message.sid); 
    });

client.messages.create({ 
        to: user_2_info.phone_number, 
        from: "+19562051565", 
        body: "New game created between you and "+user_1_info.first_name+"! Hurry and visit http://cliq.herokuapp.com to see your first prompt!",   
    }, function(err, message) { 
        console.log(message.sid); 
    });
}

exports.get_new_game_instance = function() {
	return {
			"id" : game_data.length+1,
			"game_over" : false,
			"first_user_id": "",
			"second_user_id" : "",
			"first_user_score" : 0,
			"second_user_score" : 0,
			"round" : 1,
			"current_prompt" : "Take a selfie with the most handsome gentlemen near you!",
			"first_user_completion" : 0,
			"second_user_completion" : 0,
			"score_diff": 0,
			"curr_winning": 0,
			"new_prompt": 0
		};
}

exports.get_new_game_request_instance = function() {
	return {
			"id" : "",
			"user_from_id" : "",
			"user_to_id": "", 
			"user_from_first_name": "",
			"user_from_last_name": "",
			"pending" : true,
			"seen": false
		};
}

exports.update_game = function(game) {
	var index = game.id;
  game_data.games[index] = game;
}

// exports.get_other_user_info = function(games) {
	// var users = user_data['users'];
	// var users_for_games = new Array();
	// for (var i = 0; i < users.length; i++) {
	// 	if ()
	// }
//}