$(document).ready(function(){
	$('.actions a.delete').click(function(){
		return confirm("Are you sure you want to delete this item? This action cannot be undone.");
	});
});