

var assignment_data = require("./routes/assignments.json");
var course_data = require("./routes/courses.json");

exports.get_course_by_id = function(course_id) {
    for (var i = 0; i < course_data.courses.length; i ++ ) {
        if (course_data.courses[i].id == course_id) {
            return course_data.courses[i];
        }
    }
    return false;
}

exports.get_assignment_by_id = function(assignment_id) {
    for (var i = 0; i < assignment_data.assignments.length; i ++ ) {
        if (assignment_data.assignments[i].id == assignment_id) {
            return assignment_data.assignments[i];
        }
    }
    return false;
}

