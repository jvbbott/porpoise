var user_data = require("../user_data.js");

var photodata = require("../db/photos.json");
var photos = photodata.photos;

exports.view = function(req, res){

  var curr_user_id = req.session.curr_user_id;

  var userPhoto = null;
  for (var i=0; i<photos.length; i++) {
    var takenby = photos[i].taken_by;
    if (takenby == curr_user_id) {
      userPhoto = photos[i];
    }
  }

  var currUser = user_data.get_user_by_id(curr_user_id);

  var lost = false;
  if (photos.length > 1) {
    lost = true;
  }

  res.render('round_complete', 
  {
  	'user' : currUser,
    'path_to_photo' : userPhoto.path_to_photo,
  	'lost' : lost
  });
};