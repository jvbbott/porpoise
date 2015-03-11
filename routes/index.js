/*
 * ALL OF THE STUFF THAT EVERY USER WILL SEE, THIS SHOULD BE GENERIC
 */


/* Includes user data wrapper functions */
var user_data = require('../user_data.js');
var match_data = require('../match_data.js');
var job_categories_data = require('../job_categories_data.js');


/*

CHECKS IF THE USER IS LOGGED IN AND THEN ADDS GENERIC CONTENT TO PAGE
*/
exports.view = function(req, res, curr_user){
  
  if (req.session.curr_user_id == undefined) {
  	res.redirect("/login");
  	return;
  }
  var new_user = false;
  // if (req.session.new_user != undefined && req.session.new_user) {
  //   req.session.new_user = false;
  //   new_user = true;
  // }
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
  // var user_id = req.session.curr_user_id;
  // var pending_challenges = games_data.get_game_requests_for_user(user_id);
  // console.log(pending_challenges);
  // var has_game_requests = false;
  // if (pending_challenges.length != 0) {
  //   status_messages = [{"text": "You have <a href=\"/pending\">unseen game requests</a>!", "class": "success-message", "glyphicon": "glyphicon-exclamation-sign"}];
  //   has_game_requests = true;
  // }

  var job_categories = job_categories_data.get_all_job_categories();

  console.log("USERNAME" + req.session.username + "categories: "+ job_categories);

  // var games_infos = [];
  // var past_games_infos = [];
  // for (var i=0; i<curr_games.length; i++) {   
  //   var players = curr_games[i].players;
  //   var other_player_id = "";
    
  //   var user_score = 0;
  //   var opponent_score = 0;

  //   if (players[0].id == req.session.curr_user_id) {
  //     other_player_id = players[1].id;
  //     user_score = players[0].score;
  //     opponent_score = players[1].score;
  //   } else {
  //     other_player_id = players[0].id;
  //     user_score = players[1].score;
  //     opponent_score = players[0].score;
  //   }
  //   var other_user = user_data.get_user_by_id(other_player_id);
  //   var other_user_name = other_user.first_name;

  //   var vs = other_user_name;
  //   var round = curr_games[i].current_round;
  //   var num_total_rounds = curr_games[i].num_rounds;

  //   var game_info = {"game_id" : curr_games[i].id, "icon": curr_games[i].icon, "opponent_name" : vs, "round" : round, "total_rounds" : num_total_rounds, "game_over" : curr_games[i].game_over, "user_score" : user_score, "opponent_score" : opponent_score};
  //   if (curr_games[i].game_over) {
  //     past_games_infos.push(game_info);
  //   } else {
  //     games_infos.push(game_info);
  //   }
  // }

  // var hasPastGames = true;
  // if (past_games_infos.length == 0) {
  //   hasPastGames = false;
  // }

  // console.log("GAMES INFO: "+games_infos);
  req.session.username = curr_user.username;
  // console.log("PHONE: "+req.session.phone_number);
  // console.log("length of games_infos: " + games_infos.length);

  res.render('index', 
  	{
  		'title': 'Categories',
  		'curr_user': curr_user,
      'status_messages': status_messages,
      'username': req.session.username,
      'job_categories' : job_categories
  	});

     

};