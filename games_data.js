var game_data = require('./games.json');
var user_data = require('./users.json');

exports.get_all_games = function() {
	return game_data['games'];
}

// exports.get_other_user_info = function(games) {
	// var users = user_data['users'];
	// var users_for_games = new Array();
	// for (var i = 0; i < users.length; i++) {
	// 	if ()
	// }
//}