/*
 * GET home page.
 */


/* Includes user data wrapper functions */
var user_data = require('../user_data.js');
var match_data = require('../match_data.js');
var games_data = require('../games_data.js');

exports.view = function(req, res, curr_user){
  if (req.session.curr_user_id == undefined) {
  	res.redirect("/login");
  	return;
  }
  var new_user = false;
  if (req.session.new_user != undefined && req.session.new_user) {
    req.session.new_user = false;
    new_user = true;
  }
  console.log("HEY INDEX");
  var curr_user = user_data.get_user_by_id(req.session.curr_user_id)
  // have to add this because of disabled login restriction
  //if (curr_user == undefined) {
  //  curr_user = user_data.get_new_user()
  //}
  
  console.log("STATUS MESSAGES: "+req.session.status_messages);
  // grab status message if there is one and flush
  var status_messages = [];
  if (req.session.status_messages != undefined) {
    status_messages = req.session.status_messages;
  } 

  req.session.status_messages = [];

  // look for unseen challenges & add to status message
  var user_id = req.session.curr_user_id;
  var pending_challenges = games_data.get_game_requests_for_user(user_id);
  console.log(pending_challenges);
  var has_game_requests = false;
  if (pending_challenges.length != 0) {
    status_messages = [{"text": "You have unseen game requests!", "class": "success-message", "glyphicon": "glyphicon-exclamation-sign"}];
    has_game_requests = true;
  }

  var curr_games = games_data.get_current_games_for_user(req.session.curr_user_id);

  var games_and_versus = [];
  for (var i=0; i<curr_games.length; i++) {   
    var players = curr_games[i].players;
    var other_player_id = "";
    if (players[0].id == req.session.curr_user_id) {
      other_player_id = players[1].id;
    } else {
      other_player_id = players[0].id;
    }
    var other_user = user_data.get_user_by_id(other_player_id);
    var other_user_name = other_user.first_name;

    var vs = "Play vs. " + other_user_name + "!";

    var game_and_vs = {"game_id" : curr_games[i].id, "vs_string" : vs};

    games_and_versus.push(game_and_vs);
  }

  console.log("USERNAME: "+req.session.username);
  res.render('index', 
  	{
  		'title': 'Welcome Back',
  		'curr_user': curr_user,
      'status_messages': status_messages,
      'username': req.session.username,
      'new_user': new_user, 
      'games' : curr_games,
      'games_and_versus' : games_and_versus,
      'has_game_requests' : has_game_requests,
      'challenges' : pending_challenges
  	});

     

};