
var user_data = require('../user_data.js');

exports.view = function(req, res){
  if (req.session.curr_user_id == undefined) {
  	res.redirect("/login");
  	return;
  }
  var curr_user_id = req.session.curr_user_id;
  var users = user_data.get_all_other_users(curr_user_id);

  res.render('num_rounds', 
  {
  	'title' : 'Create Game',
    'username': req.session.username,
    'status_messages': null,
    'users' : users
    // 'rounds' : null  //keep track of number of rounds user submitted
  });
  
};


exports.select_opponent = function (req, res) {
  console.log(req.body);
  var numRounds = req.body.selected;
  console.log("SELECTING " + numRounds+" ROUNDS");
  req.session.numRound = numRounds;
  

  var curr_user_id = req.session.curr_user_id;
  var users = user_data.get_all_other_users(curr_user_id);

  res.render('new_game',
  {
  	'title' : 'Create Game',
    'username': req.session.username,
    'status_messages': null,
    'users' : users,
    'round' : numRounds
  }

  );
};
