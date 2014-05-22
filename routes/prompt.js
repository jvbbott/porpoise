var user_data = require("../user_data.js");

exports.view = function(req, res){

  var currUser = user_data.get_user_by_id(req.session.curr_user_id);

  var isJoe = undefined;
  if (currUser["first_name"] == "Joe") {
  	isJoe = true;
  }

  res.render('prompt', 
  {
  	'user' : currUser,
  	'isJoe' : isJoe
  });

};


exports.picture_taken = function(req, res) {
  var tmp_path = req.files.thumbnail.path;
  var target_path = '/images/z';

  console.log("session: " + req.session);

  fs.readFile(tmp_path, function(err, data) {
    fs.writeFile(__dirname + "/../public/images/TEST", data, function(err) {
      console.log(err);
    })

  });	res.redirect("/round_complete");
}