
/***************************************************************/
/* Are these functions still necessary? */

var match_request = require("../match_request.json");
var courses = require("./courses.json");
var assignments = require("./assignments.json");
var matches = require("../matches.json");
var games = require("../db/games.json");
var user_data = require('../user_data.js');
var game_requests = require("../db/game_requests.json");


var twilio = require("../node_modules/twilio/lib");

var accountSid = 'AC5d3a15045fe20ac3a87aa9072b114ab5'; 
var authToken = 'a71d5c5997988f8f277437722898ac89'; 
var client = require('twilio')(accountSid, authToken); 


function getUserFromId(id) {
	var user = user_data.get_user_by_id(id);
    return user;
};


function getClassFromId(id) {
	var class_list = courses['courses'];
	for (var i = 0; i < class_list.length; i ++ ) {
		if (class_list[i].id == id)
			return class_list[i];
	}
};


function getMatchRequestFromId(id) {
	var match_list = match_request['match_requests'];
	for (var i = 0; i < match_list.length; i ++ ) {
		if (match_list[i].id == id)
			return match_list[i];
	}
};

function getAssignmentFromId(id) {
	var assignment_list = assignments['assignments'];
	for (var i = 0; i < assignment_list.length; i ++ ) {
		if (assignment_list[i].id == id)
			return assignment_list[i];
	}
};

function hasBeenMatched(request_id) {
	var match_list = matches['matches'];
	for (var i = 0; i < match_list.length; i++) {
		if (match_list[i].first_user_request_id == request_id ||
				match_list[i].second_user_request_id == request_id)
			return true;
	}
	return false;
};


var match_request_data = require("../match_request_data.js");
var games_data = require("../games_data.js");
var match_data = require("../match_data.js");
// var user_data = require("../user_data.js");
var course_data = require('../course_data.js');

/* Main page for matches */
exports.view = function(req, res){
  if (req.session.curr_user_id == undefined) {
  	res.redirect("/login");
  	return;
  }
  // var user_id = req.session.curr_user_id;
  // var curr_user = user_data.get_user_by_id(user_id);
  // var games = match_request_data.get_match_requests_by_user_id(1);
  //var games = games_data.get_all_games();
  // if (!games) console.log("NO GAMES FOUND");
  /* add info about class name, assignment name */
  //games = games_data.get_other_user_info(games);



  /* THIS IS WHERE I NEED TO LOOK*/
  // ------> requests = match_request_data.annotate_with_course_info();
  // var matches = match_data.get_matches_by_user(user_id);
  // console.log(matches);
  // matches = match_data.annotate_with_other_user_data(matches, user_id);
  // matches = match_data.annotate_with_course_info(matches);
  /********************************/

  // grab status message if there is one and flush
  // var status_messages = [];
  // if (req.session.status_messages != undefined) {
  //   var status_messages = req.session.status_messages;
  // } 
  // req.session.status_messages = [];

  // look for unseen matches & add to status message
  // var unseen_matches = match_data.get_unseen_matches_by_user(user_id);
  // if (unseen_matches.length > 0) {
  //   var message = "You have " + unseen_matches.length + " new match"
  //   if (unseen_matches.length > 1) {
  //       message += "es"
  //   }
  //   /* set as seen */
  //   for (var i=0; i<unseen_matches.length; i++) {
  //       match_data.set_match_as_seen(unseen_matches[i].id, user_id);
  //   }
  //   status_messages[status_messages.length] = {
  //       "text": message, 
  //       "class": "success-message", 
  //       "glyphicon": "glyphicon-ok"
  //   };
  // }
  // console.log(games);
  var curr_user_id = req.session.curr_user_id;
  var users = user_data.get_all_other_users(curr_user_id);
  res.render('new_game', 
  {
  	'title' : 'Create Game',
    'username': req.session.username,
    'status_messages': null,
    'users' : users
  });
  
};

exports.handle_create_game = function (req, res) {
  console.log(req.body.user);
  var opponent_id = req.body.user;
  var user_id = req.session.curr_user_id;
  console.log(user_id);
  var user = user_data.get_user_by_id(user_id);
  games_data.create_game_request(user_id, opponent_id, user);
  var opponent = user_data.get_user_by_id(opponent_id);
  

  console.log("OPPONENT'S PHONE: "+opponent.phone_number);
  client.messages.create({ 
        to: opponent.phone_number, 
        from: "+19562051565", 
        body: user.first_name+" has challenged you to a game on cliq!",   
    }, function(err, message) { 
        console.log(message.sid); 
    });


  var status_messages = [{"text": "Challenge submitted! Your opponent has been notified.", "class": "success-message", "glyphicon": "glyphicon-ok-sign"}];
  req.session.status_messages = status_messages;

  console.log("games.games" + games.games);
  res.redirect("/");
};

// function get_new_match_request_id() {
// 	var new_match_id = match_request_data.
// 	return new_match_id;
// };

exports.create_match_request = function(req, res) {
  console.log("CREATING MATCH REQUEST");
	var assign_id = req.body['assignment_id'];
	var assign_obj = course_data.get_assignment_by_id(assign_id);
	var known = new Array();
	var unknown = new Array();
	var numProblems = assign_obj.problems.length;
	console.log("BODY: "+JSON.stringify(req.body));
	for (var i = 1; i <= numProblems; i++) {
    console.log("PROBLEM "+i+" "+req.body['checkbox-'+i]);
		if(req.body['checkbox-'+i] == "checked") unknown.push(i);
		else known.push(i);
	}
	var user_id = req.session.curr_user_id;	
	//var new_match_request_id = get_new_match_request_id();
	var match_made = match_request_data.submit_match_request(
		user_id, assign_id, assign_obj.course_id, known, unknown);
  if (!match_made) {
    var status_messages = [{"text": "Request Submitted! Please check back periodically to see if you have been matched.    <span class=\"glyphicon glyphicon-remove\"></span> ", "class": "success-message", "glyphicon": "glyphicon-ok"}];
    req.session.status_messages = status_messages;
  
  }
  
  console.log("CREATED MATCH REQUEST - NOW REDIRECTING");
	res.redirect("/matches");
	return;
};

exports.update_request = function(req, res) {
	var match_request = getMatchRequestFromId(req.body.assign_id);
	match_request['problems_known'] = req.body.known;
	match_request['problems_unknown'] = req.body.unknown;
  var status_messages = [{"text": "Match request updated.", "class": "success-message", "glyphicon": "glyphicon-ok"}];
  req.session.status_messages = status_messages;
  res.json(match_request);
  return;
};


exports.delete_match_request = function(req, res) {
    var request = req.body.request;
    var id = parseInt(request.id);
    match_request_data.delete_match_request(id);

    // Add a status message about what happened
    var status_messages = [{"text": "Pending match request deleted.", "class": "success-message", "glyphicon": "glyphicon-ok"}];
    req.session.status_messages = status_messages;

    // redirect to matches page
    res.redirect("/matches");
    return; 
}

exports.delete_match = function(req, res) {
    var match = req.body.match;
    var match_id = parseInt(match.id);
    match_data.delete_match(match_id, req.session.curr_user_id);

    // Add a status message about what happened
    var status_messages = [{"text": "Match deleted! We are looking for a new match for you, please check back periodically.    <span class=\"glyphicon glyphicon-remove\"></span> ", "class": "success-message", "glyphicon": "glyphicon-ok"}];
    req.session.status_messages = status_messages;

    // redirect to matches page
    res.redirect("/matches");
    return; 
}

exports.edit_match_request = function(req, res) {
    console.log("EDITING MATCH REQUEST IN CONTROLLER");
    var match_request_id = req.body.request.id;
    var request = match_request_data.get_match_request_by_id(match_request_id);
    var assignment = course_data.get_assignment_by_id(request.assignment_id);
    var all_problems = assignment.problems;
    var unknowns = new Array();
    for (var i=0; i<req.body.unknowns.length; i++) {
        var unknown = parseInt(req.body.unknowns[i]);
        unknowns.push(unknown);
    }
    var knowns = new Array();
    for (var i=0; i<all_problems.length; i++) {
        if (unknowns.indexOf(all_problems[i]) == -1) {
            knowns.push(all_problems[i]);
        }
    }
    request.problems_unknown = unknowns;
    request.problems_known = knowns;
    console.log("this is the new match request");
    console.log(request);
    match_request_data.edit_match_request_record(match_request_id, request);
    
    // Add a status message about what happened
    var status_messages = [{"text": "Match request updated.", "class": "success-message", "glyphicon": "glyphicon-ok"}];
    req.session.status_messages = status_messages;

    // redirect to matches page
    console.log("redirecting");
    res.redirect("/matches");
    return;

}





