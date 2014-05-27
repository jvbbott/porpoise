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

  res.render('prompt', 
  {
  	'user' : currUser,
    'photo_arr' : photosdata.photos,
    'gameid' : req.query.game,
    'prompt' : prompt
  });

};


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
