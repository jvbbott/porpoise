var data = require('./match_request.json');
var match_object_interface = require('./match_data.js');
var course_data = require('./course_data.js');

/*-----------------------------------------------------*
 *	
 *       This is the interface for the match_request data
 *
 *		methods implemented:

 	submit_match_request(user_id, assignment_id, course_id, problems_known, problems_unknown)
	------------------------------
	This interface can be edited. i just explicitly listed all the fields of a request object as the parameters but we can package them together and send the package as the paramater. it just creates a new match_request object and adds it to the current data.

		@param -- user_id
			integer, it better be real

		@param -- assignment_id 
			integer, better correspond to actual assignment

		@param -- course_id 
			integer, better correspond to actual class

		@param -- problems_known
			array of integers, probably not empty

		@param -- problems_unknown
			array of integers, probably not empty

	


 	delete_match_request(match_request_id) 
 	---------------------------
 		deletes the match reqeust object specified by the match_request_id.

 			@param -- match_request_id
 				should be an integer associated with an actual match reqeust object in our database

	set_match_request_to_pending(match_request_id) 
	---------------------------
		this is used when someone rejects a match
		and the other user's request should be set back to pending

			@param -- match_request_id 
				shoudl be an integer and associatd with an actual request object.

	edit_match_request_record(match_request_id, new_match_request_obj)
	---------------------------
		updates the match request with the given id to be equal to the new match_request_object. i set the 'id' field of the new object to be = to match_request_id just in case

			@param -- match_request_id
				the id of the match_request that is being updated

			@param -- new_match_request_obj
				the new match request object, should be fully filled out. likely just a variation of an old one.

	get_match_request_by_id(match_request_id)
	---------------------------
	self explanatory. just returns the match request object associated with the id

		@param -- match_request_id
			the id of the match request object you want

		@return_type -- match_request_object

	get_match_requests_by_user_id(user_id)
	---------------------------
	cycles through all requests, if the request belongs to this user AND IT HAS NOT BEEN MATCHED then i add it to an array and return it. We are assuming we don't want requests that have already been matched

		@param -- user_id
			the id of the user whose unmatched requests we want.

		@return_type -- array of match_requests_objects

	get_next_id() 
	---------------------------
	we are assuming that the objects are in sorted order by their id's. we assume this because our convention tells us that each new request object gets an id that is ONE bigger than the current largest  ( a neat proof on induction could prove this)
	So we just grab the id of the last element in our 'DB' and add one to it.

		@return_type -- integer

	array_intersection(shorter, longer) 
	---------------------------
	Only used internally to find the intersection between the "known_problems" of two different match requests. N*M approached. Could be optimized with a NlogN and MlogM sort then an O(N) traversal and intersection. Basically it cylces over the larger of the two arrays and looks for each element in the shorter of the two. 

		@param -- shorter
			an array of numbers, problems a certain user knows how to do.

		@param -- longer
			an array of numbers, problems a certain user knows how to do.
		
		@return_type -- array of integers, the problems that both users know how to do.			

	possible_match(match_request_obj)
	---------------------------
	Only called internally whenever a new match request is made. 
	Cycles through all other pending matches for the same assignment and finds the biggest number of questions not in common between the parameter request object and my current looping request object.
	I find the intersection of all the problems they know, and whichever pair has the largest number of elements not in the intersection, gets matched. There could be some false logic in terms of not producing the optimal match but it works in my head. 

		@param -- match_request_obj
			the newly made match_request_obj that is looking to see if any good matches could be made right now. 

		@return_type -- match_request_obj || undefined
			this returns the matching match_request_obj that our newly made match_request_obj will be paired with, or undefined if none are found.
 *
 *
 *
 *
 *
 *
 *-----------------------------------------------------*/




 exports.annotate_with_course_info = function(match_requests) {
 	for (var i = 0; i < match_requests.length; i++) {
 		var course_id = match_requests[i].course_id;
 		var course = course_data.get_course_by_id(course_id);
 		var assignment_id = match_requests[i].assignment_id;
 		var assignment = course_data.get_assignment_by_id(assignment_id);
 		match_requests[i]['course'] = course;
 		match_requests[i]['assignment'] = assignment;
 	}
 	return match_requests;
 }


 exports.delete_match_request = function(match_request_id) {
 	for (var i = 0; i < data.match_requests.length; i++) {
 		if (data['match_requests'][i].id == match_request_id) {
 			console.log("deleting ");
 			console.log(data['match_requests'][i]);
 			data['match_requests'].splice(i, 1);
 			return;
 		}
 	}
 }


 exports.set_match_request_to_pending = function(match_request_id) {
 	for (var i = 0; i < data.match_requests.length; i++) {
 		if (data['match_requests'][i].id == match_request_id) {
 			data['match_requests'][i]['pending'] = true;
 			return;
 		}
 	}
 }

 exports.edit_match_request_record = function(match_request_id, new_match_request_obj) {
 	//just to be sure
 	new_match_request_obj['id'] = match_request_id;
 	var return_var = false;
 	var poss_match = exports.possible_match(new_match_request_obj);
 	
 	if (poss_match != undefined) {
 		return_var = true;
 		poss_match['pending'] = false;
 		match_object_interface.create_match_obj(poss_match, new_match_request_obj);
 		new_match_request_obj['pending'] = false;

 	} else {
 		new_match_request_obj['pending'] = true;
 	}
 	for (var i = 0; i < data.match_requests.length; i++) {
 		if (data['match_requests'][i].id == match_request_id) {
 			data['match_requests'][i] = new_match_request_obj;
 			return return_var;
 		}
 	}
 }

 exports.get_match_request_by_id = function(match_request_id) {
 	for (var i = 0; i < data.match_requests.length; i++) {
 		if (data['match_requests'][i].id == match_request_id) {
 			return data['match_requests'][i];
 		}
 	}
 }


 exports.get_match_requests_by_user_id = function(user_id) {
 	var all_match_requests = data['match_requests'];
 	var relevant_match_requests = new Array();
 	// cycle through all match requests
 	// if the pending = false then it is no longer a 
 	// request really so we are not returning it
	for (var i = 0; i < all_match_requests.length; i ++ ) {
		if (all_match_requests[i].user_id == user_id &&
			all_match_requests[i].pending) {
			relevant_match_requests.push(all_match_requests[i]);
		}
	}
	return relevant_match_requests;
 }


 exports.get_next_id = function() {
 	var all_requests = data['match_requests'];
 	var last_index = all_requests.length - 1;
 	if (last_index <= 0)
 		return 0;
 	return all_requests[last_index].id + 1;
 }

 //we are assuming all unique entries in these arrays
 exports.array_intersection = function(shorter, longer) {
 	var result = new Array();
 	for (var i = 0; i < longer.length; i++) {
 		if (shorter.indexOf(longer[i]) != -1) {
 			result.push(longer[i]); 			
 		}
 	}
 	return result;
 }

 exports.possible_match = function(match_request_obj) {
 	var overlap = 0; 
 	var greatest_overlap = 0;
 	var greatest_overlap_index = 0; 
 	var all_requests = data['match_requests'];
 	for (var i = 0; i < all_requests.length; i ++) {
 		// if this request has already been matched or
 		// if this request is for a different assignment
 		// then we don't care 
 		if (!all_requests[i].pending || 
 			match_request_obj.assignment_id != all_requests[i].assignment_id)
 			continue;
 		var longer = match_request_obj.problems_known;
 		var shorter = all_requests[i].problems_known
 		console.log("shorter:" + shorter);
		console.log(" longer : "+ longer);
		
 		if (shorter.length > longer.length) {
			shorter = longer;
			longer = all_requests[i].problems_known;
		}
		var intersection = exports.array_intersection(shorter, longer);
		// we know the intersection can only be as long as 
		// the shorter of the two arrays
		// this is saying that the overlap is how many
		// are in the shorter, that aren't in both
		// i.e how many do they have not in common
		
		overlap = shorter.length - intersection.length;
		console.log(" intersection : "+ intersection);
		if (overlap > greatest_overlap) {
			greatest_overlap = overlap;
			greatest_overlap_index = i;
		}
 	}

 	if (greatest_overlap > 0)
 		return all_requests[greatest_overlap_index];
 	else 
 		return undefined;
 }


 exports.submit_match_request = function (user_id, assignment_id, course_id, problems_known, problems_unknown) {
 	var new_match_request_obj = [];
 	var next_id = exports.get_next_id();
 	new_match_request_obj['id'] = next_id;
 	new_match_request_obj['user_id'] = user_id;
 	new_match_request_obj['assignment_id'] = assignment_id;
 	new_match_request_obj['course_id'] = course_id;
 	new_match_request_obj['problems_known'] = problems_known;
 	new_match_request_obj['problems_unknown'] = problems_unknown;
 	
 	var poss_match = exports.possible_match(new_match_request_obj);
 	var is_matched = false;
 	if (poss_match != undefined) {
 		poss_match['pending'] = false;
 		match_object_interface.create_match_obj(poss_match, new_match_request_obj);
 		new_match_request_obj['pending'] = false;
 		is_matched = true;

 	} else {
 		new_match_request_obj['pending'] = true;
 	}
 	data['match_requests'].push(new_match_request_obj);
 	return is_matched;
 }







