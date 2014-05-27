var photo_data = require('./db/photos.json');
var photo_arr = photo_data.photos;

var round_funcs = require('./rounds_data.js');

exports.get_photo = function(photo_id) {
	console.log(photo_data);

	for (var i=0; i<photo_arr.length; i++) {
		if (photo_arr[i].id == photo_id) {
			return photo_arr[i];
		}
	}
	return null;
}

exports.create_new_photo = function(game_id, round_id, user_id, path_to_photo) {
	// 1. create new photo
	var newPhoto = exports.get_new_photo_instance();
	newPhoto.game_id = game_id;
	newPhoto.round_id = round_id;
	newPhoto.user_id = user_id;
	newPhoto.path_to_photo = path_to_photo;
	newPhoto.date_taken = new Date();

	// 2. insert the photo into photos.json
	photo_arr.push(newPhoto);

	// 3. insert photoID into round's photo id array
	var round = round_funcs.get_round(round_id);
	round.photos.push(newPhoto.id);

	return newPhoto.id;
}

exports.get_new_photo_instance = function() {
	return {	
		"id" : photo_arr.length,
		"game_id" : "",
		"round_id" : "",
		"user_id" : "",
		"path_to_photo" : "",
		"date_taken" : ""
	}
}