var fs = require('fs');

var user_data = require("../user_data.js");
var game_funcs = require("../games_data.js");
var round_funcs = require("../rounds_data.js");
var photo_funcs = require("../photos_data.js");

var usersdata = require("../db/users.json");
var photosdata = require("../db/photos.json");


exports.view = function(req, res){

  var currUser = user_data.get_user_by_id(req.session.curr_user_id);

  var game_id = req.query.game;
  var game = game_funcs.get_game(game_id);
  var prompt = game.current_prompt;

  var current_round = game.current_round;
  var gamelogPhotos = [[]];
  var gamelogRoundIds = [];

  for (var i=0; i<current_round-1; i++) {
    gamelogRoundIds.push(game.rounds[i]);
  }

  for (var i=0; i<gamelogRoundIds.length; i++) {
    var roundId = gamelogRoundIds[i];
    var round = round_funcs.get_round(roundId);

    var photo1_id = round.photos[0];
    var photo2_id = round.photos[1];
    var photo1 = photo_funcs.get_photo(photo1_id);
    var photo2 = photo_funcs.get_photo(photo2_id); 

    var photosForRound = [photo1, photo2];
    gamelogPhotos.push(photosForRound);
  }

  var round_id = game.rounds[current_round - 1];
  var has_taken_photo = photo_funcs.user_completed_round(round_id, req.session.curr_user_id);

  var user_score = "";
  var opponent_score = "";
  var opponent_id = "";
  players = game.players;
  if (players[0].id == currUser.id) {
    user_score = players[0].score;
    opponent_score = players[1].score;
    opponent_id = players[1].id;
  } else {
    user_score = players[1].score;
    opponent_score = players[0].score;
    opponent_id = players[0].id;
  }

  var opponent = user_data.get_user_by_id(opponent_id);

  res.render('prompt', 
  {
  	'user' : currUser,
    'gamelog_photos' : gamelogPhotos,
    'gameid' : req.query.game,
    'prompt' : prompt,
    'has_not_taken_photo' : !has_taken_photo,
    'user_score' : user_score,
    'opponent_score' : opponent_score,
    'opponent' : opponent
  });

};

//check if round is over here
exports.picture_taken = function(req, res) {

  var tmp_path = req.files.photo.path;
  var curr_user_id = req.session.curr_user_id;
  var curr_date = new Date();
  var curr_date_str = curr_date.toString();
  var game_id = req.body.gameid;
  game_id = game_id[0];
  var curr_game = game_funcs.get_game(game_id);

  console.log("game_id is: " + game_id);
  console.log("curr_user_id: " + curr_user_id);
  var curr_round_number = curr_game.current_round;
  var photo_name = curr_user_id + "_" + game_id + "_" + curr_round_number;
  var path_to_photo = __dirname + "/../public/images/" + photo_name;

  var photo_json = null;

  fs.readFile(tmp_path, function(err, data) {
      // put info indo photos.json and create a new image and place it in /public/images/
      var photo_path_for_photo_obj = "../images/"+photo_name;
      var round_id = curr_game.rounds[curr_round_number-1];
      var photo_id = photo_funcs.create_new_photo(game_id, round_id, curr_user_id, photo_path_for_photo_obj);

      fs.writeFile(path_to_photo, data, function(err) {});

      res.redirect("/round_complete?photo_id="+photo_id);

  });	
}
