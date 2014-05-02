


/*
 * GET login page
 */

exports.view = function(req, res){
  // grab status message if there is one and flush
  var status_messages = req.session.status_messages;
  req.session.status_messages = [];

  res.render('login', {
        'title': 'Login',
        'status_messages': status_messages,
    });
};



/* logs out the user by clearing the session */
exports.logout = function(req, res) {
    req.session.curr_user_id = undefined;
    req.session.username = undefined;
    var status_messages = [{"text": "Logged out", "class": "success-message", "glyphicon": "glyphicon-ok"}];
    req.session.status_messages = status_messages;
    res.redirect("/login");
}




