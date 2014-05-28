var user_data = require("../user_data.js");
var photo_funcs = require("../photos_data.js");
var round_funcs = require("../rounds_data.js");
var game_funcs = require("../games_data.js");

var game_data = require('../db/games.json');

var game_requests = require('../db/game_requests.json');

var game_requests_controller = require('./game_requests.js');





var twilio = require("../node_modules/twilio/lib");

var accountSid = 'AC5d3a15045fe20ac3a87aa9072b114ab5'; 
var authToken = 'a71d5c5997988f8f277437722898ac89'; 
var client = require('twilio')(accountSid, authToken); 

exports.view = function(req, res){

  var photo_id = req.query.photo_id;
  var photo = photo_funcs.get_photo(photo_id);
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

  res.render('round_complete', 
  {
  	'user' : user,
    'path_to_photo' : photo.path_to_photo,
  	'lost' : lost
  });

  if (lost == true) { // Since there's just 2 users, if someone lost, the round is over.
    setTimeout(function(){roundOver(game);}, 15000); //pause 15 seconds
    
  }


};

// What executes when the round is over.
function roundOver(game) {

  // If the game is over...
  if (game.current_round == game.num_rounds) {
    game.game_over = true;
    return;
  }

  // Increment the current round for the game
  game.current_round = game.current_round + 1;

  // TODO: Send out prompts
  var new_prompt = "NEW PROMPT TESTING LKJ:LSKDJF:LSDKJ";
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

}





























