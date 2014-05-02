'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
    initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {

    // Get rid of status messages after a few seconds
    setTimeout(function(){
        $('.status-message').slideUp();
    }, 50000);

    $('.status-message .glyphicon-remove').click(function() {
      $('.status-message').slideUp();
    })

}

$('#search-input').keyup(function() {
            
      var searchQuery = $(this).val();
      var results = $.get('/get_classes_query', {'query': searchQuery}, populateAutoComplete);

         
  });

function populateAutoComplete(result) {
  var classMatches = [];
  for (var i = 0; i < result.length; i++) {
  	console.log("MATCH: "+result[i].name);
    var course = {};
    course.label = result[i].full_name;
    course.value = result[i].full_name;
  	// console.log(classMatches);
  	classMatches.push(course);
  }
	$("#search-input").autocomplete({
              source: classMatches,
              select: function(event, ui) {
                console.log(ui.item.value+" was selected");
                window.location.href= '/search?query='+ui.item.value;
              }
            });
    console.log("POPULATING AUTO COMPLETE WITH: "+JSON.stringify(classMatches));
}

          




