
/* Includes user data wrapper functions */
var user_data = require('../user_data');



exports.login_or_signup = function(req, res) {
    var email = req.body.email;
    var curr_user = user_data.get_user_by_email(email);

    if (curr_user == undefined) {
        // This is a new sign-up
        // create blank user & redirect to set up profile page
        curr_user = user_data.get_new_user();
        curr_user.email = email;
        user_data.update_user(curr_user);
        req.session.curr_user_id = curr_user.id;
        res.redirect("/new-profile");
    } else {
        // This user exists. Send to homepage
        req.session.curr_user_id = curr_user.id;
        req.session.username = curr_user.first_name;
        res.redirect("/");        
    } 
}


/* GET - profile update form */
exports.render_update_profile = function(req, res){
    /* always make sure they're logged in */
    if (req.session.curr_user_id == undefined) {
        res.redirect("/login");
        return;
    }

    var user = user_data.get_user_by_id(req.session.curr_user_id);
    if (user == undefined) {
        user = user_data.get_new_user();
    }

    res.render('profile', {
      		'title' : 'Update Profile',
            'user': user,
            'username': req.session.username
  	});
};

/* GET - Renders form for creation of new profile */
exports.create_new_profile = function(req, res) {
    var new_user = user_data.get_user_by_id(req.session.curr_user_id);
    res.render('create_profile', {
            'title' : 'Create Profile',
            'no_home_button' : true,
            'user': new_user
    });
}

/* POST - Handles posting of user data */
exports.handle_create_profile = function(req, res) {
    var user = req.body.user;
    user.id = parseInt(user.id);
    user_data.update_user(user);
    // Add a status message about what happened
    var status_messages = [{"text": "New profile created.", "class": "success-message", "glyphicon": "glyphicon-ok"}];
    req.session.status_messages = status_messages;

    // this is a real user now
    req.session.curr_user_id = user.id;
    req.session.username = user.first_name;
    // let the homepage know this user is new
    req.session.new_user = true;

    // redirect to home page
    res.redirect("/");
    return; 
};


/* POST - Handles posting of user data */
exports.handle_update_profile = function(req, res) {
    var user = req.body.user;
    user.id = parseInt(user.id);
    user_data.update_user(user);
    // Add a status message about what happened
    var status_messages = [{"text": "Profile updated.", "class": "success-message", "glyphicon": "glyphicon-ok"}];
    req.session.status_messages = status_messages;

    // redirect to home page
    res.redirect("/");
    return; 
};



