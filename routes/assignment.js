var assignmentsData = require("../routes/assignments.json");
var courses = require("./courses.json");
var user_data = require("../user_data.js");

/*
 * GET home page.
 */

function getClassFromId(id) {
	var class_list = courses['courses'];
	for (var i = 0; i < class_list.length; i ++ ) {
		console.log(class_list[i]);
		console.log("looking for "+id);
		if (class_list[i].id == id)
			return class_list[i];
	}

};

exports.view = function(req, res) {
    if (req.session.curr_user_id == undefined) {
        res.redirect("/login");
        return;
    }
    var curr_user = user_data.get_user_by_id(req.session.curr_user_id);

	var assignment_id = req.query.id;
	var assignment = [];
	var assignmentName;
	if (assignment_id) {
		assignment = assignmentsData.assignments.filter(function(pset) {
			if (pset.id == assignment_id) {
				assignmentName = pset.name.substring(0, 10);
				return true;
			}
		});
		console.log(assignment);
	}

	var class_obj = getClassFromId(assignment[0].course_id);
	console.log(class_obj);
  	res.render('assignment', 
  	{
  		'title' : assignmentName,
  		'assignment' : assignment,
  		'course_name' : class_obj.name,
  		'course_id' : class_obj.id,
       'username': curr_user.first_name
  	});

};