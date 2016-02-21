$(document).ready(function(){
	$('nav .expandable > div').click(function(){
		$("nav #subnav").collapse({toggle:false});
		$("nav #subnav").collapse('toggle');
		if($(this).parent().hasClass("expanded"))
			$(this).parent().removeClass("expanded");
		else
			$(this).parent().addClass("expanded");
		return false;
	});
});