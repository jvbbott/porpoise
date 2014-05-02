var courseData = require("../routes/courses.json");
var user_data = require("../user_data.js");

/*
 * GET match search page.
 */

exports.view = function(req, res){
    if (req.session.curr_user_id == undefined) {
        res.redirect("/login");
        return;
    }
    var curr_user = user_data.get_user_by_id(req.session.curr_user_id);

	var queryUnsplit = req.query.query;
	console.log("CHECKING QUERY: "+queryUnsplit);
	var matches = courseData;
	if (queryUnsplit) {
		matches = courseData.courses.filter(function(course){
			var contString = course.full_name.split(' ').join('');
			// console.log("CONT STRING: "+contString);
			// console.log("QUERY: "+queryUnsplit);
			var querySplit = queryUnsplit.split(' ').join('');
			console.log("COMPARING "+querySplit.toLowerCase()+" TO "+contString.toLowerCase());
			return contString.toLowerCase().indexOf(querySplit.toLowerCase()) >= 0;
		});
	}
	else {
			matches = courseData.courses.filter(function(course) {
			return course.popular == "true";
		});
	}
	// for (var i = 0; i < matches.length; i++) {
	// 	matches[i].name = matches[i].name.substring(0, 35);
	// }
    console.log("user: ");
    console.log(curr_user);
    console.log("username: " + req.session.username);

    res.render('search', 
    	{
    		'query' : queryUnsplit,
    		'title' : 'Search',
    		'matches' : matches,
            'username': req.session.username
  	});
};

exports.get_classes_from_query = function(req, res) {
	res.json(courseData.courses);
}