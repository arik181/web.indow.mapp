$(document).ready(function(){
	$('.inline_submit').click(function(){
		var id = $(this).data('formid');
		var enabled = $(this).data('enabled');
		var editButton = $(this);
		//check if we're already in editting mode, save if so.
		if(enabled)
			return true;
		//check for other rows being editted, alert if found
		var cancelReturn = false;
		$('.inline_submit').each(function(){
			if($(this).data("enabled"))
			{
				alert("You may only edit one item at a time.");
				cancelReturn = true;
			}
		});
		if(cancelReturn)
			return false;
		editButton.data('enabled','enabled');
		$("input[name$='-" + id + "']").attr("disabled",null);
		$("input[name$='-" + id + "']").first().focus();
		$('.field_div[data-fieldid="' + id + '"]').hide();
        $("textarea[name$='-" + id + "']").show();
    	$("textarea[name$='-" + id + "']").attr("disabled",null);
		$("textarea[name$='-" + id + "']").first().focus();
		$("button[data-formid=" + id + "] span").attr("class","glyphicon glyphicon-floppy-disk");
		$("button[data-formid=" + id + "] + a span").attr("class","glyphicon glyphicon-ban-circle");
		$("button[data-formid=" + id + "] + a").unbind('click').click(function(){
			editButton.data('enabled',null);
			$("input[name$='-" + id + "']").attr("disabled","disabled");
            $("textarea[name$='-" + id + "']").hide();
            $('.field_div[data-fieldid="' + id + '"]').show();
            $("textarea[name$='-" + id + "']").attr("disabled","disabled");
			$("button[data-formid=" + id + "] span").attr("class","glyphicon glyphicon-pencil");
			$("button[data-formid=" + id + "] + a span").attr("class","glyphicon glyphicon-trash");
			$("button[data-formid=" + id + "] + a").unbind('click').click(function(){
				return confirm("Are you sure you want to delete this item? This action cannot be undone.");
			});
			return false;
		});
		return false;
	});
});