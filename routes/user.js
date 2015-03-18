/* Includes user data wrapper functions */
var user_data = require('../user_data');
var twilio = require("../node_modules/twilio/lib");

var accountSid = 'AC5d3a15045fe20ac3a87aa9072b114ab5'; 
var authToken = 'a71d5c5997988f8f277437722898ac89'; 
var client = require('twilio')(accountSid, authToken); 



exports.render_verification_page = function(req, res) {
    console.log("INCORRECT CODE, REDIRECTING");
    res.render('verification', {
            'title' : 'Enter Verification Code',
            'user': curr_user
    });
    return; 
}

exports.create_account = function(req, res) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;

    console.log("ABOUT TO CREATE NEW ACCOUNT");
    if (user_data.user_exists(req.body.username)) {
        console.log("USERNAME ALREADY EXISTS");
        var status_messages = [{"text": "Username already exists.", "class": "error-message", "glyphicon": "glyphicon-exclamation-sign"}];
        req.session.status_messages = status_messages;
        res.render("create_account", {
            'title' : 'porpoise',
            'status_messages' : status_messages
        });
    }
    // var curr_user = user_data.get_new_user();
    // curr_user.id = user_data.get_new_id();
    // curr_user.phone_number = req.body.phone;
    // curr_user.first_name = req.body.first_name;
    // curr_user.last_name = req.body.last_name;
    // curr_user.password = req.body.password;
    // console.log("NEW USER CREATED ------");
    // console.log(curr_user);

    // this is a real user now - add to session
    // console.log(curr_user.id);
    // req.session.curr_user_id = curr_user.id;

    // var auth_code = Math.floor((Math.random() * 9000) + 1000);

    // Add a status message about what happened
    
    
    // client.messages.create({ 
    //     to: "+1"+curr_user.phone_number, 
    //     from: "+19562051565", 
    //     body: "Cliq Verification Code: "+auth_code,   
    // }, function(err, message) { 
    //     console.log(message.sid); 
    // });

    // curr_user.auth_code = auth_code;
    // user_data.update_user(curr_user);
    

    
    // let the homepage know this user is new
    // req.session.new_user = true;

    // send to verification page
    // res.render('verification', {
    //         'title' : 'Enter Verification Code',
    //         'user': curr_user
    // });
    // return; 

    return;
}

exports.login_or_signup = function(req, res) {
    //encrypt password here and create salt
    console.log(req);
    var username = req.body.username;
    var password = req.body.password;
    var curr_user = user_data.get_user_by_username(username);
    if (password == "") {
        var status_messages = [{"text": "Invalid password.", "class": "error-message", "glyphicon": "glyphicon-exclamation-sign"}];
        req.session.status_messages = status_messages;
        res.redirect("/login");  
    }   
    if (curr_user == undefined) {
            req.session.active_username = username;
            req.session.active_password = password;
        }
        else {
            var status_messages = [{"text": "Invalid phone number.", "class": "error-message", "glyphicon": "glyphicon-exclamation-sign"}];
            req.session.status_messages = status_messages;
            res.redirect("/login");  
        }
    if (password == curr_user.password) {
        console.log("THIS USER EXISTS");
        // This user exists. Send to homepage
        req.session.curr_user_id = curr_user.id;
        req.session.username = curr_user.first_name;
        res.redirect("/");        
    } 
    else {
        var status_messages = [{"text": "Incorrect password.", "class": "error-message", "glyphicon": "glyphicon-exclamation-sign"}];
        req.session.status_messages = status_messages;
        res.redirect("/login");
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


/* POST - Handles phone number validation */
exports.handle_validation = function (req, res) {
    var curr_user = user_data.get_user_by_id(req.session.curr_user_id);
    console.log(curr_user);
    var code_entered = req.body.code;
    if (code_entered == curr_user.auth_code) {
        curr_user.phone_validated = true;
        user_data.update_user(curr_user);
        if (curr_user.first_name != undefined) {
            var status_messages = [{"text": "Welcome, "+curr_user.first_name+"! <a href=\"/num_rounds\">Create a new game now!</a>", "class": "success-message", "glyphicon": "glyphicon-ok-sign"}];
        }
        else {
          var status_messages = [{"text": "Welcome! <a href=\"/num_rounds\">Create a new game now!</a>", "class": "success-message", "glyphicon": "glyphicon-ok-sign"}];  
        }
        req.session.status_messages = status_messages;
        res.redirect("/");
    }
    else {
        var status_messages = [{"text": "Validation code incorrect. Try again.", "class": "error-message", "glyphicon": "glyphicon-exclamation-sign"}];
        req.session.status_messages = status_messages;
        res.render("verification", {
            'title': "Enter Verification Code",
            'status_messages': status_messages});
        return;
    }
}

/* POST - Handles posting of user data */
exports.handle_create_profile = function(req, res) {
    console.log("ABOUT TO CREATE NEW PROFILE");
    var new_phone = req.body.phone;
    console.log(req.body.phone);
    if (user_data.user_exists(req.body.phone)) {
        console.log("USER ALREADY EXISTS");
        var status_messages = [{"text": "Phone already exists.", "class": "error-message", "glyphicon": "glyphicon-exclamation-sign"}];
        req.session.status_messages = status_messages;
        res.redirect("/new-profile");
        return;  
    }
    var curr_user = user_data.get_new_user();
    curr_user.id = user_data.get_new_id();
    curr_user.phone_number = req.body.phone;
    curr_user.first_name = req.body.first_name;
    curr_user.last_name = req.body.last_name;
    curr_user.password = req.body.password;
    console.log("NEW USER CREATED ------");
    console.log(curr_user);

    // this is a real user now - add to session
    console.log(curr_user.id);
    req.session.curr_user_id = curr_user.id;

    var auth_code = Math.floor((Math.random() * 9000) + 1000);

    // Add a status message about what happened
    
    
    client.messages.create({ 
        to: "+1"+curr_user.phone_number, 
        from: "+19562051565", 
        body: "Cliq Verification Code: "+auth_code,   
    }, function(err, message) { 
        console.log(message.sid); 
    });

    curr_user.auth_code = auth_code;
    user_data.update_user(curr_user);
    

    
    // let the homepage know this user is new
    req.session.new_user = true;

    // send to verification page
    res.render('verification', {
            'title' : 'Enter Verification Code',
            'user': curr_user
    });
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