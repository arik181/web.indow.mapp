$(document).ready(function ()
{
    $('#annual_mort_ins_conventional').autoNumeric('init', {vMax: '99.999', vMin: '0.000'});
    $('#annual_mort_ins_fha').autoNumeric('init', {vMax: '99.999', vMin: '0.000'});
    $('#upfront_mort_ins_fha').autoNumeric('init', {vMax: '99.999', vMin: '0.000'});
    $('#annual_mort_ins_usda').autoNumeric('init', {vMax: '99.999', vMin: '0.000'});
    $('#funding_fee_usda').autoNumeric('init', {vMax: '99.999', vMin: '0.000'});
    $('#funding_fee_va').autoNumeric('init', {vMax: '99.999', vMin: '0.000'});
    $('#loan_interest_rate').autoNumeric('init', {vMax: '99.999', vMin: '0.000'});
    $('#loan_term').autoNumeric('init', {vMax: '99', vMin: '0'});
    $('#loan_purchase_price').autoNumeric('init', {vMax: '9999999', vMin: '0'});
    $('#loan_down_payment').autoNumeric('init', {vMax: '99.999', vMin: '0.000'});
    $('#loan_property_tax').autoNumeric('init', {vMax: '99999', vMin: '0'});
    $('#loan_hoa').autoNumeric('init', {vMax: '9999', vMin: '0'});
    $('#loan_hazard_insurance').autoNumeric('init', {vMax: '9999', vMin: '0'});
    $('.amount').autoNumeric('init', {vMax: '9999999', vMin: '0'});

    $('#add_condition_button').click(function (e) {
        e.preventDefault();

        var
            condition   = $(this).prev().val(),
            loan_id     = $('input[name="loan_id"]').val(),
            append      = null;

        if (condition == '')
            return;

        $.ajax({
            type: "POST",
            url: document.URL.replace('/edit', '')+"/loan/"+loan_id+"/condition/add",
            data: { condition: condition }
        }).done(function (condition_id) {
            append =
                "<div class=\"condition\">"+
                    "<input type=\"checkbox\" style=\"width:20%; margin:0; clear:left;float:left;display:inline-block;\" name=\"conditions[]\" id=\"required_condition_"+condition_id+"\" value=\""+condition_id+"\" checked=\"checked\">"+
                    "<label for=\"required_condition_"+condition_id+"\" style=\"width:80%;float:left; clear:none;display:inline-block\">"+condition+"</label>"+
                "</div>";
            $('#custom_conditions').append(append);
        });

        $(this).prev().val('');
    });

    $('.accept_condition, .decline_condition, .received_condition').click(function (e) {
        e.preventDefault();

        var parent = $(this).parent();

        $.ajax({
            type: "POST",
            url: this
        }).done(function (result) {
            parent.hide();
        });

    });

	$('#add_income_button, #add_debt_button').click(function (e) {
    	e.preventDefault();

    	//is this for the debt or income table?
    	var table = "income";
    	if($(this).attr('id') == 'add_debt_button')
    		table = "debt";

        if ( !$(this).siblings('.description').val() || !$(this).siblings('.amount').val() )
            return false;

        $btn = $(this);
        var desc = $btn.siblings('.description').val();
        var amount = $btn.siblings('.amount').val();

		$.ajax({
			type: "POST",
			url: "/buyers/add_"+table,
			data: {
				'buyer_id': $('#buyer_id').val(),
				'desc': desc,
				'amount': amount
			}
		}).done(function( result ){
			if(result > 0){
				id = result;

				list_item  = '<li>';
				list_item += "<a href='#' data-id='"+id+"' class='button remove_"+table+"_button'>&times;</a>";
				list_item += desc;
				list_item += '<span class="amount">';
				list_item += "&#36;"+amount;
				list_item += '</span>';
				list_item += '</li>';

				$btn.parent().siblings('ul').append(list_item);
				$btn.siblings('.description').val('');
				$btn.siblings('.amount').val('');
				//update total
	    		amount = parseInt(amount.replace(/[^0-9]/g, ""));	//remove non-digits
		    	total = parseInt($('#total_'+table).text().replace(/[^0-9]/g,""));
		    	$('#total_'+table).text( intToDollars((total + amount), ",") );
			}
			else{
				alert("Failed to add "+table+". ("+result+")");
			}
		});
    });

    $('#incomes ul, #debts ul').on('click', '.button', function (e) {
    	e.preventDefault();
    	$btn = $(this);

    	//is this for the debt or income table?
    	var table = "income";
    	if($btn.hasClass('remove_debt_button'))
    		table = "debt";

    	var id = $btn.data('id');
    	var amount = $btn.siblings('.amount').text();
    	$.ajax({
    		type: "POST",
    		url: "/buyers/remove_"+table,
    		data: {
				'buyer_id': $('#buyer_id').val(),
    			'id': id
    		}
    	}).done(function( result ){
    		if(result > 0){
	    		$btn.closest('li').remove();
	    		//update total
	    		amount = parseInt(amount.replace(/[^0-9]/g, ""));	//remove non-digits
	    		total = parseInt($('#total_'+table).text().replace(/[^0-9]/g,""));
	    		$('#total_'+table).text( intToDollars((total - amount), ",") );
	    	}
	    	else{
	    		alert("Failed to remove "+table+". ("+result+")");
	    	}
    	});
    });

    $('.loan_type_checkbox').click(function () {
        $(this).siblings('.loan_mortgage_insurance').toggle();
    });
});

function intToDollars(i, separator){
	s = "$"+i;
	return s.replace(/\B(?=(?:\d{3})+(?!\d))/g, separator);
}
