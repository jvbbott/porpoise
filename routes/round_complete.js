
var user_data = require("../user_data.js");

exports.view = function(req, res){
 

   var currUser = user_data.get_user_by_id(req.session.curr_user_id);

  var isJoe = undefined;
  if (currUser["first_name"] == "Joe") {
  	isJoe = true;
  }

  res.render('round_complete', 
  {
  	'user' : currUser,
  	'isJoe' : isJoe
  });
};