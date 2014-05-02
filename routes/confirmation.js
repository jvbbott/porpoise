/*
 * GET home page.
 */

exports.view = function(req, res){
	//
	// push request to new json file
	//
  res.render('confirmation', 
  	{
  		'title' : "Confirmation"
  	});
};