$(document).ready(function() {

$(".ui-loader").hide();
$('.account-type button').on("touchend", function() {
		// $('.btn-selected').removeClass('btn-selected');
		$(this).addClass('btn-selected');
});	
// $('button#student').on("tap", function() {
// 	console.log("Student clicked");
// 	$('.optional').hide();
// 	$('.student').show();
// 	$('.btn-selected').addClass("btn-default");
// 	$('.btn-selected').removeClass("btn-selected");
// 	$(this).addClass("btn-selected");
// });

// $('button#teacher').on("tap", function() {
// 	console.log("Teacher clicked");
// 	$('.optional').hide();
// 	$('.teacher').show();
// 	$('.btn-selected').addClass("btn-default");
// 	$('.btn-selected').removeClass("btn-selected");
// 	$(this).addClass("btn-selected");
// });

// $('button#professional').on("tap", function() {
// 	console.log("Teacher clicked");
// 	$('.optional').hide();
// 	$('.professional').show();
// 	$('.btn-selected').addClass("btn-default");
// 	$('.btn-selected').removeClass("btn-selected");
// 	$(this).addClass("btn-selected");
// });

});
