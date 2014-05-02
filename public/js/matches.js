'use strict';
var editState;
var activeEdit = -1;

$(document).ready(function() {
	editState = true;
	$('.match_info').hide();
	$('.match p').each(function() {
		$(this).click(function() {
			$(this).siblings(".match_info").toggle();
		}); 
	});
		// var known = new Array();
		// var unknown = new Array();
		// var form_string = "<form action='/edit-match-request' method='post' class='form-inline' role='form'>";
		// var request_id = $(this).attr('id').substr('edit-'.length);
		// form_string += "<input type='hidden' name='request[id]' class='text' value='" + request_id + "'>";
		// $(this).parent(".match_inf").find(".known li").each(function(){
		// 	form_string += "<div class='form-group'><label>"+ $(this).html() + "</label>" +
		// 		"<input type=\"checkbox\"" + 
		// 		"name='unknowns[" + $(this).html()+"]'" +
		// 		"value=\"" + $(this).html()+"\" "+
		// 		"class=\"question_box\"></div>";
		// });
		// $(this).parent(".match_inf").find(".unknown li").each(function(){
		// 	form_string += "<div class='form-group'><label>"+ $(this).html() + "</label>" +
		// 		"<input type=\"checkbox\"" + 
		// 		"name='unknowns[" + $(this).html()+"]'" +
		// 		"value=\"" + $(this).html()+"\" checked=true" +
		// 		" class=\"question_box\"></div>";
		// });
		// form_string += "<button type='submit' class='btn'>Update Match Request</button></form>"
		// $(this).parent('.match_inf').html(
		// 	"<p> Check the boxes of the problems you need help on </p>" + form_string);


		/*
			$(".submit").each(function() {
				$(this).click(function() {
					var assign_id = $(this).parent(".match_inf").attr('id');
					var known = new Array();
					$(this).parent(".match_inf").find(".question_box:checked").each(function() {
						known.push($(this).val());
					});
					var unknown = new Array();
					$(this).parent(".match_inf").find(".question_box:not(:checked)").each(function() {
						unknown.push($(this).val());
					});
					$.post("/post-update-match-request", {
						'assign_id' : assign_id,
						'known' : known,
						'unknown' : unknown
					}, updateRequest);

					
				});
			});
		*/
		// initClick();
	 });


	

$(".editbtn").click(function () {
			var assign_id = parseInt(this.id.match(/\d+/));

			if (activeEdit == -1) {
				activeEdit = assign_id;
				editState = true;
				// console.log("ASSIGNING NEW ACTIVE EDIT");
			}
			else if (activeEdit != assign_id) {
				// console.log("WE HAVE AN NON-ACTIVE EDIT - EXITING");
				return;
			}
			
      if (editState) {
      	activeEdit = assign_id;

      	$(this).animate({
      		backgroundColor: '#2a6496',
      		color: "#ffffff"
      	});
      	$(this).html("<i class=\"fa fa-save fa-med\"></i> Save");
        $( "#effect"+assign_id).animate({
          backgroundColor: '#FFFFC0',
          color: "#ffffff"
        }, 1000 );

        editState = false;
        $('ul.assignment-'+assign_id+' li.img-rounded').click(function(e) {
        	var problemId = parseInt(this.className.match(/\d+/));
        	console.log(problemId);
        		var input = $("input[name='checkbox-"+problemId+" assignment-"+assign_id+"']");
        		if ($(this).hasClass('unknown') && $(input).is(':checked')) {
        			console.log("MOVING NEEDED PROBLEM TO COMPLETED");
        			$(this).removeClass('unknown');
        			$(this).addClass('known');
        			$(this).find('i').removeClass('fa-check-circle-o');
              $(this).find('i').addClass('fa-plus');
        		}
        		else {
        			console.log("MOVING COMPLETED PROBLEM TO NEEDED");
        			$(this).removeClass('known');
        			$(this).addClass('unknown');
        			$(this).find('i').removeClass('fa-plus');
        			$(this).find('i').addClass('fa-check-circle-o');
        		}
   
             
            }
            );

      } else {
      	console.log("DONE EDITING");
      	activeEdit = -1;
      	editState = false;
      	$(this).animate({
      		backgroundColor: 'green',
      		color: "#ffffff"
      	});
      	$(this).html("<i class=\"fa fa-pencil fa-med\"></i> Edit");
        $( "#effect"+assign_id).animate({
          backgroundColor: '#F5F5F5',
          color: "#fff"
        }, 1000 );
        console.log("ABOUT TO INIT CLICK");
        saveUpdatedRequest(assign_id);

        //save shit and refresh page
      }
    });

function saveUpdatedRequest(assign_id) {
			// var form_string = "<form>";
			// $(this).parent(".match_inf").find(".known li").each(function(){
			// 	form_string += "<input type=\"checkbox\"" + 
			// 		"name=\"" + $(this).html()+"\"" +
			// 		"value=\"" + $(this).html()+"\" checked=true"+
			// 		" class=\"question_box\">" +
			// 		"<p>"+ $(this).html() + "</p></br>";
			// });
			// $(this).parent(".match_inf").find(".unknown li").each(function(){
			// 	form_string += "<input type=\"checkbox\"" + 
			// 		"name=\"" + $(this).html()+"\"" +
			// 		"value=\"" + $(this).html()+"\"" +
			// 		" class=\"question_box\">" +
			// 		"<p>" +$(this).html() + "</p></br>";
			// });
			// $(this).parent('.match_inf').html(
			// 	"<p> Check the boxes of the" + 
			// 	"problems you know</p>" + form_string + "</form>" +
			// 	"<div class=\"clickable submit\">" +
			// 	"<p>SUBMIT</p></div>");
			// $(".submit").each(function() {
			// 	$(this).click(function() {
					var assignment_problems = $("ul.assignment-"+assign_id);
					var known = new Array();
					$(assignment_problems).children("li.known").each(function() {
						var problemNumber = $(this).attr('class').match(/\d+/);
						known.push(problemNumber);
					});
					var unknown = new Array();
					$(assignment_problems).children("li.unknown").each(function() {
						var problemNumber = $(this).attr('class').match(/\d+/);
						unknown.push(problemNumber);
					});
					console.log("ABOUT TO POST NEW MATCH REQUEST");
					console.log("KNOWN: "+known);
					console.log("UNKNOWN: "+unknown);
					$.post("/post-update-match-request", {
						'assign_id' : assign_id,
						'known' : known,
						'unknown' : unknown
					}, updateRequest);

					
	// 			});
	// });



};

function updateRequest(data) {
	// var html_string = "<p> You know:</p>" +
	// 					"<ul class=\"known\">";
	// for (var i = 0; i < data['problems_known'].length; i++) {					
	// 	html_string += "<li>"+data['problems_known'][i]+"</li>";
	// }

	// html_string += "</ul>" +
	// 	"<p> You need help on:</p>" +
	// 	"<ul class=\"unknown\">";

	// for (var j = 0; j < data['problems_unknown'].length; j++) {
	// 	html_string += "<li>"+ data['problems_unknown'][j]+"</li>";
	// }
	// html_string +=" <div class=\"clickable edit\">" +
	// 	"<p>EDIT</p></div>" +
	// 	"<div class=\"clickable delete\">" +
	// 	"<p>DELETE</p></div>";
	// var curr_id = data['id'];
	// $(".match_inf#"+curr_id+"").html(html_string);
	// initClick();
	window.location.href = "matches";
}


