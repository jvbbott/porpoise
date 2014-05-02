	
var data = require('./matches.json');
var match_request_interface = require('./match_request_data.js');
var user_data = require('./user_data.js');
var course_data = require('./course_data.js');

/*-----------------------------------------------------*
 *	
 *       This is the interface for the match data
 *
 *		methods implemented:




	
 	delete_match(match_object, deleting_user_id);
 	---------------------------
	 	Deletes the match request of the deleting user, sets 
	 	the other match request status back to pending = true 
	 	so that it can be considered for matches. 
	 		
	 		@param -- match_request_obj
	 			must be the entire request object, if all you 
	 			have is the id then call get_match_by_id
	 			then pass what function returns as a parameter 
	 			here

 			@param -- deleting_user_id
 				the user id of the deleting user, will most 
 				likely be the id in the session variable
 				'request.session.curr_user_id' or something 
 				like that.

 	get_match_by_id(match_id) 
 	------------------------------
 		cycles through all matches and returns the object 
 		with the corresponding id. returns undefined if none is found
 			
 			@param -- match_id
 				should be an integer, and the integer of a
 				match object.


	set_match_as_seen(match_id, user_id)
	------------------------------
		obtains the match associated with the match_id 
		parameter and updates it to to reflect that this
		user has seen it. It assumes that the user_id is actually
		associated with the match (i.e is one of the two users
		matched by this match_object)
			
			@pparam -- match_id
				the id of the match_object

			@param -- user_id 
				the id of the user who just "saw" the match



	update_match_object(match_id, attribute, new_value)
	------------------------------
		This updates the match object associated with the match_id
		by changing the attribute to now be set to new_value
		*************THIS METHOD MIGHT BE BUGGY*****************
		It relies on all fields of an object to set to something 
		and not be undefined

			@param -- match_id
				the id of the match_object to be updated

			@param -- attribute
				the attribute field of the object to
				be updated

			@param -- new_value
				the new value the specified attribute should now
				be equal to


	get_matches_by_user(user_id)
	------------------------------
	cycles through all the matches collecting all of them 
	that involves the given user

		@param -- user_id
			the id of the user for whom we want all their 
			mathces

		@return_type
			array of match objects


	create_match_object(first_request, second_request)
	------------------------------
	Takes two match reqeusts and pairs them. this is called
	from match_request_data.js. Do not call this yourself
	since this is part of our matching "algorithm"

		@param -- first_request
			the first match_request_obj of our new match pair

		@param -- second_request 
			the second match_request_obj of our new match pair
 *
 *
 *
 *
 *
 *
 *-----------------------------------------------------*/

exports.match_is_unseen = function(match, user_id) {
	if (user_id == match.first_user_id) {
		if (match.seen_by_first_user == 'unseen' || !match.seen_by_first_user) {
			return true;
		}
	} else {
		if (match.seen_by_second_user == 'unseen' || !match.seen_by_second_user) {
			return true;
		}
	}
	return false;
}


exports.get_unseen_matches_by_user = function(user_id) {
	var matches = exports.get_matches_by_user(user_id);
	var unseen_matches = [];
	for (var i=0; i<matches.length; i++) {
		if (exports.match_is_unseen(matches[i], user_id)) {
			unseen_matches[unseen_matches.length] = matches[i];
		}
	}
	return unseen_matches;
}



exports.annotate_with_other_user_data = function(matches, curr_user_id) {
	for (var i=0; i < matches.length; i++) {
		var match = matches[i];
		var other_user_id = match.first_user_id;
		if (other_user_id == curr_user_id) {
			other_user_id = match.second_user_id;
		}
		var user = user_data.get_user_by_id(other_user_id);
		match['other_user'] = user;
	}
	return matches;
}

 exports.annotate_with_course_info = function(matches) {
 	if (matches == undefined) 
 		return;
 	for (var i = 0; i < matches.length; i++) {
 		var request = match_request_interface.get_match_request_by_id(matches[i].first_user_request_id);
 		var course = course_data.get_course_by_id(request.course_id);
 		var assignment = course_data.get_assignment_by_id(request.assignment_id);
 		matches[i]['course'] = course;
 		matches[i]['assignment'] = assignment;
 	}
 	return matches;
 }



 exports.delete_match = function(match_id, deleting_user_id) {
 	var match = exports.get_match_by_id(match_id);
 	var first_match_request_id = match.first_user_request_id;
 	var second_match_request_id = match.second_user_request_id;
 	
 	//update both requests to pending again.
 	match_request_interface.set_match_request_to_pending(first_match_request_id);
 	console.log("peidng: " + first_match_request_id);
 	console.log("peidng: " + second_match_request_id);
	match_request_interface.set_match_request_to_pending(second_match_request_id);
 	// now we find this match object and delete it
 	var all_matches = data['matches'];
 	for (var i = 0; i < all_matches.length; i++) {
 		if (all_matches[i].id == match.id) {
 			data['matches'].splice(i, 1);
 			break;
 		}
 	}
 }


 exports.get_match_by_id = function(id) {
 	for (var i = 0; i < data.matches.length; i++) {
 		if (data.matches[i].id == id)
 			return data.matches[i]
 	}
 	return undefined;
 }


exports.set_match_as_seen = function(match_id, user_id) {
	var match_object = exports.get_match_by_id(match_id);
	if (match_object.first_user_id == user_id) {
		match_object.seen_by_first_user = true;
	} else {
		match_object.seen_by_second_user = true;
	}
}

exports.update_match_object = function(match_id, attribute, new_value) {
	var match_object = get_match_by_id(match_id);
	if (match_object) {
		// tests to see that the attribute is a valid attribute
		if (match_object[attribute] != undefined) {
			match_object[attribute] = new_value;
		}

	}


}

exports.get_matches_by_user = function(user_id) {
	var all_matches = data['matches'];
	var relevant_matches = new Array();
	//cycle through all mathces, if either user
	// associated with this match is the user we want
	// add that match to our array
	for (var i = 0; i < all_matches.length; i ++ ) {
		if (all_matches[i].first_user_id == user_id ||
			all_matches[i].second_user_id == user_id ) {
			relevant_matches.push(all_matches[i]);
		}
	}
	return relevant_matches;
}

exports.get_next_match_id = function() {
 	var all_matches = data['matches'];
 	var last_index = all_matches.length - 1;
 	if (last_index < 0)
 		return 0;
 	return all_matches[last_index].id + 1;
}


exports.create_match_obj = function(first_request, second_request) {
	var new_match = [];
	new_match['id'] = exports.get_next_match_id();
	new_match['first_user_id'] = first_request.user_id;
	new_match['second_user_id'] = second_request.user_id;
	new_match['first_user_request_id'] = first_request.id;
	new_match['second_user_request_id'] = second_request.id;
	new_match['seen_by_first_user'] = false;
	new_match['seen_by_second_user'] = false;
	data['matches'].push(new_match);
}




