$(document).ready(function(){
	$(".form_accordion").click(function(){
		var collapsed = false;
		if($('#the_fieldset').hasClass("collapse"))
			collapsed = true;
		$('#the_fieldset').collapse({toggle: false});
		$('#the_fieldset').collapse('toggle')

		if(collapsed)
		{
			$('#the_fieldset').animate({marginBottom:"20px"});
			$('.the_submitter').css('width','0px');
			$('.the_submitter').css('opacity','0');
			$('.the_submitter').css('padding','0');
			$('.the_submitter').css('margin','0');
			$('.the_submitter').css('display','inline-block');
			$('.the_submitter').animate({opacity:1,width:"50px",padding:'0 10px',marginRight:"20px"});
			$('.form_accordion').text("Cancel");
		}
		else
		{
			$('#the_fieldset').animate({marginBottom:"0px"});
			$('.the_submitter').animate({opacity:0,width:"0px",padding:'0 0px',marginRight:"0px"});
			$('.form_accordion').text($('.form_accordion').data("button_label"));
		}
		return false;
	});
});
