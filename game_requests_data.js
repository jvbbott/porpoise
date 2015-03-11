var data = require("./db/game_requests.json");


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

//adds new game _request
exports.update_game_request = function(game_request) {
	var index = game_request.id;
	console.log("ADDING GAME REQUEST WITH ID "+index);
    game_requests.game_requests[index] = game_request;
}