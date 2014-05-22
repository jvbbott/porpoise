var game_data = require('./games.json');
var user_data = require('./users.json');
var game_requests = require('./game_requests.json');

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

exports.create_game_request = function(user_1, user_2) {
	return;
}

// exports.get_other_user_info = function(games) {
	// var users = user_data['users'];
	// var users_for_games = new Array();
	// for (var i = 0; i < users.length; i++) {
	// 	if ()
	// }
//}