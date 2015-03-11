// var round_data = require('./db/rounds.json');
// var round_arr = round_data.rounds;

// var game_funcs = require('./games_data.js');

// exports.get_round = function(round_id) {
// 	for (var i=0; i<round_arr.length; i++) {
// 		if (round_arr[i].id == round_id) {
// 			return round_arr[i];
// 		}
// 	}
// 	return null; 
// }

// // Creates a new round, and inputs the round ID into the games' roundID array as well
// exports.create_new_round = function(new_game, game_id, prompt) {
// 	// 1. Create the round 
// 	var newRound = exports.get_new_round_instance();
// 	newRound.game_id = game_id;
// 	newRound.prompt = prompt;
// 	newRound.date_started = new Date();

// 	// 2. Insert the round into the rounds.json
// 	round_arr.push(newRound);

// 	console.log("Round is FUCK THIS SHIT");
// 	console.log("GAMEID IS: "+newRound.game_id);
// 	console.log("PROMPT IS: "+newRound.prompt);


// 	// 3. Insert the round's ID into the games' round IDs 
// 	// var game = game_funcs.get_game(game_id);
// 	// console.log("Current game is: "+ game);

// 	new_game.rounds.push(newRound.id);
	

// }

// exports.get_new_round_instance = function() {
// 	return {
// 		"id" : round_arr.length,
// 		"game_id" : "",
// 		"prompt" : "",
// 		"date_started" : "",
// 		"photos" : []
// 	}
// }
