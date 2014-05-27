var user_data = require("../user_data.js");
var photo_funcs = require("../photos_data.js");
var round_funcs = require("../rounds_data.js");
var game_funcs = require("../games_data.js");

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
    roundOver(game);
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
}





























