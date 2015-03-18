


/*
 * GET login page
 */

exports.view = function(req, res){
  // grab status message if there is one and flush
  var status_messages = req.session.status_messages;
  req.session.status_messages = [];
  res.render('login', {
        'title': 'Login',
        'status_messages': status_messages
    });
};

exports.login_or_signup = function(req, res) {
  var status_messages = req.session.status_messages;
  req.session.status_messages = [];
  res.render('create_account', {
    'title' : 'porpoise',
    'status_messages' : status_messages,
    'username' : req.body.username
  })
}

exports.render_create_account = function(req, res) {
  console.log(req.session.status_messages);
  var status_messages = req.session.status_messages;
  req.session.status_messages = [];
  res.render('create_account', {
    'title' : 'yo',
    'status_messages' : 'hi'
  });
}

/* logs out the user by clearing the session */
exports.logout = function(req, res) {
    req.session.curr_user_id = undefined;
    req.session.username = undefined;
    var status_messages = [{"text": "Logged out", "class": "success-message", "glyphicon": "glyphicon-ok-sign"}];
    req.session.status_messages = status_messages;
    req.session.numRound = 0;
    res.redirect("/login");
}




