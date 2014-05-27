var user_data = require("../user_data.js");
var game_funcs = require("../games_data.js");

var fs = require('fs');

var usersdata = require("../db/users.json");
var photosdata = require("../db/photos.json");


exports.view = function(req, res){

  var currUser = user_data.get_user_by_id(req.session.curr_user_id);

  res.render('prompt', 
  {
  	'user' : currUser,
    'photo_arr' : photosdata.photos,
    'gameid' : req.query.game
  });

};


exports.picture_taken = function(req, res) {

  var tmp_path = req.files.photo.path;
  var curr_user_id = req.session.curr_user_id;
  var curr_date = new Date();
  var curr_date_str = curr_date.toString();
  var game_id = req.body.gameid;
  var curr_game = game_funcs.get_game(game_id);
  var curr_round = curr_game.current_round;
  var photo_name = curr_user_id + "_" + game_id + "_" + curr_round;
  var path_to_photo = __dirname + "/../public/images/" + photo_name;

  var photo_json = null;

  fs.readFile(tmp_path, function(err, data) {

      // put info indo photos.json and create a new image and place it in /public/images/
      photo_json = {
        "taken_by": curr_user_id,
        "taken_at": curr_date_str,
        "path_to_photo": "../images/"+photo_name,
        "promptID" : "testPromptID"
      }
      photosdata.photos.push(photo_json);

      fs.writeFile(path_to_photo, data, function(err) {});

  });	

  res.redirect("/round_complete");
}

function getGame(gameid) {

}