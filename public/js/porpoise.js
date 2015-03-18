$(document).ready(function() {

$(".ui-loader").hide();
$('.account-type button').click(function(e) {
	console.log($('.btn-selected'));
	$('.account-type .btn-selected').removeClass('btn-selected');
	$(this).addClass('btn-selected');
	e.stopPropagation();
	return false;
});
});
