var user_data = require("../user_data.js");
var photo_funcs = require("../photos_data.js");
var round_funcs = require("../rounds_data.js");
var game_funcs = require("../games_data.js");

var game_data = require('../db/games.json');

var game_requests = require('../db/game_requests.json');

var game_requests_controller = require('./game_requests.js');

var prompt_data = require ("../db/prompts.json");



var twilio = require("../node_modules/twilio/lib");

var accountSid = 'AC5d3a15045fe20ac3a87aa9072b114ab5'; 
var authToken = 'a71d5c5997988f8f277437722898ac89'; 
var client = require('twilio')(accountSid, authToken); 

exports.view = function(req, res){

  var photo_id = req.query.photo_id;
  var photo = photo_funcs.get_photo(photo_id);
  
  console.log(photo);

  var user_id = req.session.curr_user_id;
  var user = user_data.get_user_by_id(user_id);
  var round_id = photo.round_id;
  var round = round_funcs.get_round(round_id);
  var game_id = round.game_id;
  var game = game_funcs.get_game(game_id);

  var lost = false;

  var numPriorPhotoSubmissions = round.photos.length;

  // if the user WON
  if (numPriorPhotoSubmissions == 1) {
    game_funcs.incrementScoreForUser(game_id, user_id, 1);
  
  // if the user LOST
  } else {
    lost = true;
  }

  // set the finished_round to true for the given player
  var players = game.players;
  if (players[0].id == user_id) {
    players[0].finished_round = true;
  } else {
    players[1].finished_round = true;
  }

  res.render('round_complete', 
  {
  	'user' : user,
    'path_to_photo' : photo.path_to_photo,
  	'lost' : lost
  });

  if (lost == true) { // Since there's just 2 users, if someone lost, the round is over.
    // increment the current_round for the game by 1
    game.current_round = game.current_round + 1;
    setTimeout(function(){roundOver(game);}, 15000); //pause 15 seconds
  }


};

// What executes when the round is over.
function roundOver(game) {

  // If the game is over...
  if (game.current_round > game.num_rounds) {
    game.game_over = true;
    return;
  }

  // send out a random prompt
  var prompts_arr_size = prompt_data.prompts.length;
  var prompt_ceiling = prompts_arr_size-1;
  var prompt_x = Math.floor((Math.random() * prompt_ceiling) );
  var new_prompt = prompt_data.prompts[prompt_x].prompt;

  game.current_prompt = new_prompt;
  round_funcs.create_new_round(game, game.id, new_prompt);

  var user_1_info = user_data.get_user_by_id(game.players[0].id);
  var user_2_info = user_data.get_user_by_id(game.players[1].id);

  client.messages.create({ 
        to: "+1"+user_1_info.phone_number, 
        from: "+19562051565", 
        body: "New round created between you and "+user_2_info.first_name+"! Hurry and visit http://cliqme.herokuapp.com to see the new prompt!",   
    }, function(err, message) { 
        console.log(message.sid); 
    });

  client.messages.create({ 
        to: "+1"+user_2_info.phone_number, 
        from: "+19562051565", 
        body: "New round created between you and "+user_1_info.first_name+"! Hurry and visit http://cliq.herokuapp.com to see the new prompt!",   
    }, function(err, message) { 
        console.log(message.sid); 
    });

  // set the players' finished_rounds to false
  game.players[0].finished_round = false;
  game.players[1].finished_round = false;

}