var user_data = require('../user_data');


exports.view = function(req, res) {
	console.log("INCORRECT CODE, REDIRECTING");
    res.render('verification', {
            'title' : 'Enter Verification Code'
    });
    return; 
}