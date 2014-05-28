var game_data = require('./db/games.json');
var user_data = require('./db/users.json');
var game_requests = require('./db/game_requests.json');
var user_data_controller = require('./user_data.js');
var game_requests_controller = require('./routes/game_requests.js');
var rounds_data_controller = require('./rounds_data.js');
var prompt_data = require('./db/prompts.json');


var twilio = require("./node_modules/twilio/lib");

var accountSid = 'AC5d3a15045fe20ac3a87aa9072b114ab5'; 
var authToken = 'a71d5c5997988f8f277437722898ac89'; 
var client = require('twilio')(accountSid, authToken); 

exports.get_all_games = function() {
	return game_data['games'];
}

exports.get_game = function(game_id) {
	var all_games = game_data['games'];
	console.log("ALL GAMES: "+ all_games);
	for (var i = 0; i <= all_games.length; i++) {
		console.log("i = "+i+" all_games[i] = " + all_games[i] + " GAME_ID is: "+ game_id + " LENGTH = " + all_games.length);
		if (all_games[i].id == game_id) {
			console.log("GAME ID MATCH FOUND!");
			return all_games[i];
		}
	}

	return null;
}

// increments the score for a user.
// just give it the game_id, user_id, and how much you want the user's score incremented
exports.incrementScoreForUser = function(game_id, user_id, plus) {
	var game = exports.get_game(game_id);
	var players = game.players;
	for (var i=0; i<players.length; i++) {
		if (players[i].id == user_id) {
			players[i].score = players[i].score + plus;
		}
	}
}

exports.get_current_games_for_user = function(curr_user_id) {
	console.log("CURR USER ID IN GET GAMES: "+curr_user_id);
	var all_games = game_data['games'];
	console.log("ALL GAMES LOLOL: "+ all_games);
	var curr_games_for_user = [];
	for (var i = 0; i < all_games.length; i++) {
		var players = all_games[i].players;
		if (players[0].id == curr_user_id || players[1].id == curr_user_id) {
			console.log("ADDING GAME ID: "+all_games[i].id);
			curr_games_for_user.push(all_games[i]);
		}
	}

	console.log("CURR_GAMES_FOR_USER (in the games_data) : " + curr_games_for_user);

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

exports.create_game_request = function(user_1, user_2, user_1_info, numRounds) {
	var new_request = exports.get_new_game_request_instance();
	new_request.id = game_requests.game_requests.length; //length of array
	new_request.user_from_id = user_1;
	new_request.user_to_id = user_2;
	new_request.user_from_first_name = user_1_info.first_name;
	new_request.user_from_last_name = user_1_info.last_name;
	new_request.game_rounds = numRounds;
	game_requests_controller.update_game_request(new_request);
	console.log(new_request);
	return;
}

exports.accept_request = function(request) {
	var num_rounds = request.game_rounds;
	var user_1_id = request.user_from_id;
	var user_2_id = request.user_to_id;

	console.log("user 1 id = "+ user_1_id);
	console.log("user 2 id = "+ user_2_id);
	console.log("num rounds in accept request = "+ num_rounds);
	console.log(request);

	var new_game = exports.get_new_game_instance();

	// new_game.first_user_id = user_1_id;
	// new_game.second_user_id = user_2_id;
	// exports.update_game(new_game);
	// new_game.num_rounds = num_rounds;
	new_game.players[0].id = user_1_id;
	new_game.players[1].id = user_2_id;
	new_game.num_rounds = num_rounds;

	//find new prompt randomly
	var prompts_arr_size = prompt_data.prompts.length;
	var prompt_ceiling = prompts_arr_size-1;
	var prompt_x = Math.floor((Math.random() * prompt_ceiling) );
	var new_prompt = prompt_data.prompts[prompt_x].prompt;

	new_game.current_prompt = new_prompt; 					
	console.log("NEW GAME ID in games_Data is: "+ new_game.id);

	//create rounds and insert into new game
	console.log("GAME_DATA.length is: "+game_data.games.length);

	rounds_data_controller.create_new_round(new_game, new_game.id, new_game.current_prompt);

	game_data.games.push(new_game);
	console.log("NEW_GAME PUSHED TO DB");
	console.log("Rounds of NEW_GAME: " + num_rounds);
	console.log("GAMES ARRAY: "+ game_data.games);
	


	//send texts
	var user_1_info = user_data_controller.get_user_by_id(user_1_id);
	var user_2_info = user_data_controller.get_user_by_id(user_2_id);
	
	client.messages.create({ 
        to: "+1"+user_1_info.phone_number, 
        from: "+19562051565", 
        body: "New game created between you and "+user_2_info.first_name+"! Hurry and visit http://cliqme.herokuapp.com to see your first prompt!",   
    }, function(err, message) { 
        console.log(message.sid); 
    });

	client.messages.create({ 
        to: "+1"+user_2_info.phone_number, 
        from: "+19562051565", 
        body: "New game created between you and "+user_1_info.first_name+"! Hurry and visit http://cliq.herokuapp.com to see your first prompt!",   
    }, function(err, message) { 
        console.log(message.sid); 
    });
    return new_game;
}

exports.get_new_game_instance = function() {
	return {
			"id" : game_data.games.length, //already one in db by default
			"game_over" : false,
			"num_rounds" : "",
			"players": [
				{
					"id": "",
					"score": 0,
					"finished_round" : false
				},
				{
					"id": "",
					"score": 0,
					"finished_round" : false
				}
			],
			"current_round" : 1,
			"current_round_started" : false,
			"current_prompt" : "Test",
			"date_started" : "",
			"rounds" : []
		};
}

exports.get_new_game_request_instance = function() {
	return {
			"id" : "",
			"user_from_id" : "",
			"user_to_id": "", 
			"user_from_first_name": "",
			"user_from_last_name": "",
			"game_rounds":0,
			"pending" : true,
			"seen": false
		};
}

exports.update_game = function(game) {
	var index = game.id;
  // game_data.games[index] = game;
}

// exports.get_other_user_info = function(games) {
	// var users = user_data['users'];
	// var users_for_games = new Array();
	// for (var i = 0; i < users.length; i++) {
	// 	if ()
	// }
//}