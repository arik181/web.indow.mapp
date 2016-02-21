/*

Copyright 2011-2013 Indow Windows. 
Contents and function of the Indow Windows measuring application are confidential information for use only by parties authorized by Indow Windows.

Original: Revised 12 May 2010 derived from http://blog.darkcrimson.com/2010/05/local-databases/
Licensed: MIT License: http://www.opensource.org/licenses/mit-license.php
Modified: Spring 2011 by cseppa@gmail.com
Updated: Fall 2013 by cseppa@gmail.com
Modified: Fall 2014 by techsupport@mediamechanic.net

*/

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

/***
**** VALIDATE WINDOW **
***/ 		
function validateWindow(max_width, max_height, product_type)
{
	// init measurement data 
	var invalid 			     = false; // if true, alert and do not allow submit
	var passed  			     = true; // if false, alert and allow submit
    var validation_notes         = '';
	var alert_notes			     = "";
	var pass_with_warning        = false;  

	// dimensions
	var A         = convertToDecimal($.trim($('#A').val()));
	var B         = convertToDecimal($.trim($('#B').val()));
	var C         = convertToDecimal($.trim($('#C').val()));
	var D         = convertToDecimal($.trim($('#D').val()));
    var E         = $('#E').val();
    var F         = $('#F').val();
    var extension = ($('#extension_state').text()=='true') ? 12 : 0;
    E             = E.replace(/\s{2,}/g, ' '); // remove extra whitespace chars
    F             = F.replace(/\s{2,}/g, ' '); // remove extra whitespace chars
    E             = convertToDecimal($.trim(E)); // trim outside
    F             = convertToDecimal($.trim(F)); // trim outside

    // Add extension to diagonals
    E_EXT = Number(E) + Number(extension);
    F_EXT = Number(F) + Number(extension);

    // take the three measurements for each diag, select the largest, store in primary input box
    var E_MAX = E_EXT; //Math.max(E,E_2,E_3);
    var F_MAX = F_EXT; //Math.max(F,F_2,F_3);

    // check to make sure we have valid numeric values and that they are greater than 1 to catch odd fractional sprites
    if (isNaN(E_MAX) || E_MAX < 1) { $('#E').focus(); alert('E value is not valid.'); invalid = true; passed = false; }
    if (isNaN(F_MAX) || F_MAX < 1) { $('#F').focus(); alert('F value is not valid.'); invalid = true; passed = false; }

	
	// convert frame dims
	var frame_depth_top       = convertToDecimal($('#frameDepth :selected').val());
	var frame_depth_left      = convertToDecimal($('#frameDepth :selected').val());
	var frame_depth_bottom    = convertToDecimal($('#frameDepth :selected').val());
	var frame_depth_right     = convertToDecimal($('#frameDepth :selected').val());
	var frame_depth_required  = .625; // MAGIC replace with gvar (aka > 5/8")
	var frame_depth_threshold = .876; // MAGIC replace with GVAR  (aka > 7/8")
	var frame_step            = $('#frameStep').val();

	// sanity checks
	if (!isNumber(B) || B == '' || B < 1) 	{
		invalid = true; 
		passed = false; 
		validation_notes = validation_notes + ' Missing value';
		alert('B is a non-numeric value!\nWe cannot continue until valid!'); 
	}
	if (!isNumber(A) || A == '' || A < 1) 	{
		invalid = true; 
		passed = false; 
		validation_notes = validation_notes + ' Missing value';
		alert('A is a non-numeric value!\nWe cannot continue until valid!'); 
	}
	if (!isNumber(C) || C == '' || C < 1) 	{
		invalid = true; 
		passed = false; 
		validation_notes = validation_notes + ' Missing value';
		alert('C is a non-numeric value!\nWe cannot continue until valid!'); 
	}
	if (!isNumber(D) || D == '' || D < 1) 	{
		invalid = true; 
		passed = false; 
		validation_notes = validation_notes + ' Missing value';
		alert('D is a non-numeric value!\nWe cannot continue until valid!'); 
	}
    if (!isNumber(E_MAX) || E_MAX == '' || E_MAX < 1) {
        invalid = true; 
        passed = false; 
        validation_notes = validation_notes + ' Missing value'; 
        alert('E is a non-numeric value!\nWe cannot continue until valid!'); 
    }
    if (!isNumber(F_MAX) || F_MAX == '' || F_MAX < 1) { 
        invalid = true;
        passed = false; 
        validation_notes = validation_notes + ' Missing value'; 
        alert('F is a non-numeric value!\nWe cannot continue until valid!'); 
    }
	if (!isNumber(frame_depth_top) || frame_depth_top == '') 	{ 
		invalid = true;
		passed = false; 
		alert('frame_depth is a non-numeric value!\nWe cannot continue until valid!'); 
	}
	
	//validate window using z9170.js
	var dimstring = B + ',' + A + ',' + C + ',' + D + ',' + E_MAX + ',' + F_MAX;
	var retval = validCheck(dimstring);
	var validity_check = true; 
	if (retval == 0)  
	{ 
		validity_check = false;
		passed = false; 
		alert_notes = alert_notes + '\nMeasurement Error: Dimensions not valid\nPlease check your values and revalidate\nprior to saving.\n';
		validation_notes = validation_notes + "- MEASUREMENT VALIDATION ERROR "; 
	}
	else
	{
		passed = true;
	}
	// calculations
	var sqinches = getSquareInches(C,A);
	var sqfeet 	 = getSquareFeet(sqinches);
	console.log('sqin: ' + sqinches + ' :: sqft: ' + sqfeet); // ttt
	
	// frame depth threshold - run individual checks
	if (frame_depth_top < frame_depth_threshold || frame_depth_left < frame_depth_threshold || frame_depth_bottom < frame_depth_threshold || frame_depth_right < frame_depth_threshold)
	{ 
		// frame depth - run individual checks
		if (frame_depth_top < frame_depth_required)
		{ 
			var depth_msg1 = (frame_depth_top < frame_depth_required) ? " - Frame Depth" : "";
			var tackon =  (depth_msg1.length > 0) ? " - TOO SHALLOW " : "";
			pass_with_warning = true;
			validation_notes = validation_notes + depth_msg1 + tackon;
			alert_notes = alert_notes + depth_msg1 + tackon;
			alert_notes = alert_notes + '\nMinimum frame depth is 5/8".\nAn Indow Window installed on a frame step with less than 5/8" will not function properly.\nA solution must be recorded in the Notes field.'; 
		} else if (frame_depth_top > .626 && frame_depth_top < 1) {
			var depth_msg1 = (frame_depth_top < frame_depth_required) ? " - Frame Depth" : "";
			var tackon =  (depth_msg1.length > 0) ? " - TOO SHALLOW " : "";
			pass_with_warning = true;
			validation_notes = validation_notes + depth_msg1 + tackon;
			alert_notes = alert_notes + depth_msg1 + tackon;
			alert_notes = alert_notes + '\nIndow Windows installed on frame steps smaller than 1" are prone to venting.\nAdditional hardware may be required to hold the insert in place.'; 
		} else if (frame_depth_top > 2) {
			var depth_msg1 = (frame_depth_top < frame_depth_required) ? " - Frame Depth" : "";
			var tackon =  (depth_msg1.length > 0) ? " - TOO SHALLOW " : "";
			pass_with_warning = true;
			validation_notes = validation_notes + depth_msg1 + tackon;
			alert_notes = alert_notes + depth_msg1 + tackon;
			alert_notes = alert_notes + '\nIndow Windows should be installed within 1-3" of the existing window. If your frame step is over 3" you may want to use tape and mark the location to facilitate measurement.'; 
        }


		var tdepth_msg1 = (frame_depth_top < frame_depth_threshold) ? " -" : "";
		var tdepth_msg2 = (frame_depth_left < frame_depth_threshold) ? " -" : "";
		var tdepth_msg3 = (frame_depth_bottom < frame_depth_threshold) ? " -" : "";
		var tdepth_msg4 = (frame_depth_right < frame_depth_threshold) ? " -" : "";
		pass_with_warning = true;
		validation_notes = validation_notes + tdepth_msg1 + tdepth_msg2 + tdepth_msg3 + tdepth_msg4;
		alert_notes = alert_notes + tdepth_msg1 + tdepth_msg2 + tdepth_msg3 + tdepth_msg4;
	}
	
	// spines added at a certain size
	var top_spine_needed 	= (B >= 42 && C >= 30) ? 'yes' : 'no'; // if big window, we need top spine
	var side_spines_needed 	= (C >= 60 && B >= 36) ? 'yes' : 'no'; // if bigger window we need side spines too
	if (product_type === 'Insert/Sleep' || product_type === 'Skylight/Sleep') {
		top_spine_needed = 'no';
		side_spines_needed = 'no';
	}
	var spine_extended = "\n\n* IF there IS NOT room for spines:\nyou are required to record this \ninformation along with a solution\n to this issue in the Notes Field. \n\nIf we are not notified, \na spine will be added to this window. \nSpines cannot be removed after the fact\n without damage to the Indow Window.";
	if (top_spine_needed == 'yes' && side_spines_needed == 'yes')
	{
		pass_with_warning = true;
		alert_notes = alert_notes + '\nThis is a big window!\nCheck top and side spine clearance.';
		alert_notes = alert_notes + spine_extended;
	}
	else if (top_spine_needed == 'yes')
	{
		pass_with_warning = true;
		alert_notes = alert_notes +  '\nThis is a big window! Check for top spine clearance.';
		alert_notes = alert_notes + spine_extended;
	}
	else if (side_spines_needed == 'yes')
	{
		pass_with_warning = true;
		alert_notes = alert_notes +  '\nThis is a big window! Check for side spine clearance.';
		alert_notes = alert_notes + spine_extended;
	}
	else 
	{
		// nada
	}
	
	// apply check on acrylic availability
	var productTypeIndex = $('#productType').val();	
    var productTypeArray = ["A-BG", "A-CG", "A-STD", "AG", "BG", "CG", "MG", "PG", "SG", "STD"]
    var productType = productTypeArray[productTypeIndex];

    console.log("productType:::");
    console.log(productType);

    // Determine longest sides as basis for availabilty of acrylic
    var side1 = ( A > B ) ? A : B;
    var side2 = ( C > D ) ? C : D;
    var available;
    console.log(product_type, 'foobar');
    if (product_type === 'Legacy Insert/Standard' || product_type === 'T2 Insert/Standard') {
        if (acrylicAvailableCheck(side1,side2,max_height,max_width) === 'no' && acrylicAvailableCheck(side1,side2,73.5,97.5) === 'no') {
            available = 'no';
        } else {
            available = 'yes';
        }
    } else {
        available = acrylicAvailableCheck(side1,side2,max_height,max_width);
    }
	if (available == 'no')
	{
		invalid = true;
		passed = false;
		pass_with_warning  = false;

        // Old message may still be required by client, pending request.
		//alert('Size Restriction! The combination of window size and treatment you requested is not available.');

        alert_notes = "The combination of window size and product type you selected is not available.\nYou may need to divide the window with mullions. Please refer to our Mullion Kit guide for instructions." + alert_notes;
	}
	
	// Check for critical errors
	if (invalid == true)
	{
		var alert_notes_passthru = '';
		passed = false;
		validation_notes = validation_notes + ' [FAILED]'; 		
		if (pass_with_warning == true) 
		{ 
			alert_notes_passthru = alert_notes;
		};
		//alert_notes =  "Measurement Error: Dimensions not valid. Please check your values and remeasure where necessary until your measurements pass validation." + alert_notes_passthru;
	}
	if (passed == true)
	{
		// passed validation
		if (pass_with_warning == true)
		{
			if (validity_check == true)
			{
				validation_notes = '[PASSED]' + validation_notes;
			}
			else
			{
				validation_notes = validation_notes;
				alert_notes = alert_notes;
			}
		}
		else
		{
			validation_notes = validation_notes + ' [PASSED]'; // we are pattern matching on this string later so if changed here, update appside as well
			alert_notes =  "Window passed validation! Don’t forget to add any important notes before moving on!";			
		}
	}
	// POST BACK FORM VALUES FOR INSERT	
	//$('#E').val(E_MAX);
	//$('#F').val(F_MAX);


    var well_type = '';
    if ( passed && pass_with_warning )
    {
        well_type = 'alert-warning';

    } else if ( passed ) {

        well_type = 'alert-message';

    } else {

        well_type = 'alert-error';
    }
    
    return { 'passed'            : passed,
             'warning'           : pass_with_warning,
             'well_type'         : well_type,
             'spines'            :
             { 
               'top_side_spines' : (( top_spine_needed   == 'yes' ) &&    ( side_spines_needed == 'yes' )),
               'top_spine'       : (( top_spine_needed   == 'yes' ) &&  ! ( side_spines_needed == 'yes' )), 
               'side_spines'     : (( side_spines_needed == 'yes' ) &&  ! ( top_spine_needed   == 'yes' ))
             }, 
             'alert_notes'       : alert_notes 
           };
}

/***
**** IF BIG WINDOW, MAKE THICKER **
***/
function calculatePaneThickness(square_feet)
{
	var thickness = 0.000; 			
	if (square_feet < 20.000)
	{ 
		thickness = 0.118;		
	} 
	else 
	{
		thickness = 0.177;   		
	}
	return thickness;
}

/***
**** HELPER **
***/
function handleInsertNull()
{
	console.log('Null Data'); 
}
/***
**** HELPER **
***/
function handleInsertError(transaction,error)
{
	console.log('Error encountered: ' + error.message + ' (Code ' + error.code + ')');
}
/***
**** HELPER **
***/
function insertOrderSuccessHandler()
{
	console.log('Order successfully inserted.');
}

function randomFromTo(from, to){
	return Math.floor(Math.random() * (to - from + 1) + from);
}
    
/***
**** Error handling **
***/
function errorHandler(transaction, error){
 	if (error.code==1){
 		// DB Table already exists
 		console.log('Oops.  Database tables already exist. (Code '+error.code+')');
 	} else {
    	// Error is a human-readable string.
	    console.log('Oops.  Error: '+error.message+' (Code '+error.code+')');
 	}
    return false;
}

function print_r(theObj){
  if(theObj.constructor == Array ||
     theObj.constructor == Object){
    document.write("<ul>")
    for(var p in theObj){
      if(theObj[p].constructor == Array||
         theObj[p].constructor == Object){
document.write("<li>["+p+"] => "+typeof(theObj)+"</li>");
        document.write("<ul>")
        print_r(theObj[p]);
        document.write("</ul>")
      } else {
document.write("<li>["+p+"] => "+theObj[p]+"</li>");
      }
    }
    document.write("</ul>")
  }
}

/***
**** Convert Fraction to Decimal Value **
***/
function convertToDecimal(fraction)
{
	var result 	 = 0.00;
	if (fraction.indexOf('/') != -1)  // does it look like a fractional value?
	{
		if (fraction.indexOf(' '))
		{
			piecearr   = fraction.split(" ");
			piececount = piecearr.length;
			// if there is a whole integer part as well as a fraction
			if (piececount > 1)
			{
				var numdenom = piecearr[1]; // this is the whole number, if there is one 
				var whereisslash = numdenom.indexOf('/'); // does it look like a fractional value?
				if (whereisslash == -1) // did we find a slash?
				{
					result = 'noslash'; // we have only a whole value
					console.log('whole value'); // ttt
				}
				else
				{
					ndarr = numdenom.split("/"); // split the value at the slash
					ndarrcount = ndarr.length;  // count the numerators and denominators
					if (ndarrcount > 1)  // is there a numerator and a denominator?
					{  
						calcnd = ndarr[0] / ndarr[1]; // divide numerator by the denominator
						addbig = parseFloat(piecearr[0]) + parseFloat(calcnd); // add whole number and decimal equivalent of fraction
						result = addbig.toFixed(3); // trim to three decimal places and save
						console.log('fraction with numerator: ' + result); // ttt
					}
					else
					{
						result = 'badnumdenom'; // we don't have a properly formatted fraction
					}
				}
			}
			else // if there is only a fraction without a numerator
			{
				var numdenom = piecearr[0]; // this is the first element when we have a fraction without a whole number
				ndarr = numdenom.split("/"); // split the value at the slash
				ndarrcount = ndarr.length; // count the numerators and denominators
				if (ndarrcount > 1) // is there a numerator and a denominator?
				{  
					calcnd = ndarr[0] / ndarr[1]; // divide numerator by the denominator
					addbig = 0 + parseFloat(calcnd); // add whole number and decimal equivalent of fraction - in this case it is zero
					result = addbig.toFixed(3); // trim to three decimal places and save
					console.log('fraction without numerator: ' + result); // ttt 
				}
				else
				{
					result = 'badnumdenom'; // we don't have a properly formatted fraction
				}
			}
		}
		else
		{
			alert('Your fractional value must be separated from the whole integer by a space.');  // we expect a space in the value
		}
	}
	else
	{
		result = fraction;
	}
	return parseFloat(result);
}

/***
**** Get Square Inches **
***/
function getSquareInches(window_height,window_width)
{
	if (isNaN(window_height) && isNaN(window_width))
	{
		alert("getSquareInches function says height or width are not numeric values.");
	}
	else
	{
		square_inches = window_height * window_width;
		return square_inches;
	}
}

/***
**** Get Square Feet **
***/
function getSquareFeet(square_inches)
{
	if (isNaN(square_inches)) 
	{
		alert("getSquareFeet function says square inches is not a numeric value."); 
	}
	else
	{
		square_feet = (square_inches / 144);
		return square_feet;
	}
}

/***
**** ROUND **
***/
function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

/***
**** CONFIRM **
***/
function confirmDeletion() {
	msg = "Are you sure you want to delete this window record?";
	return confirm(msg);
}

// MAPP 2 size comparison
function acrylicAvailableCheck(height,width,max_height, max_width)
{
    max_height = parseFloat(max_height);
    max_width = parseFloat(max_width);
    var max_longest  = ( max_height > max_width ) ? max_height : max_width;
    var max_shortest = ( max_height > max_width ) ? max_width  : max_height;

    if ( height > max_longest
    ||   width  > max_longest
    || (( width > max_shortest ) && ( height > max_shortest )))
    {
        return 'no';

    } else {

        return 'yes';
    }
}

// Old size check from MAPP 1, for reference
// return a 'yes' or 'no' for a given treatment in a given height and width
/*
function acrylicAvailableCheck(height,width,treatment)
{
    console.log(height);
    console.log(width);
    console.log(treatment);

	var available_array = acrylicAvailable(height,width);
    console.log(available_array);

	if ($.isArray(available_array) && available_array.length > 0)
	{
		console.log('There are ' + available_array.length + ' available treatments');
		if( $.inArray(treatment, available_array) > -1 )
		{
			console.log('Treatment ' + treatment + ' was found in the available array:');
			console.log((JSON.stringify(available_array)));
			return 'yes';
		}
		else
		{
			return 'no';
		}
	}
	return 'no';
}
*/
	
// return an array of available treatments for a given height and width
function acrylicAvailable(height,width)
{
	var four  = 49.5;
	var five  = 61.5;
	var six   = 73.5;
	var eight = 97.5;
	var ten   = 121.5;
	var ret   = [];
	// calcs for ten by five
	if (height <= ten && width <= five) { ret.push('STD'); } 
	if (width <= ten && height <= five) { ret.push('STD'); }
	// calcs for eight by six
	if (height <= eight && width <= six) { ret.push('AG'); ret.push('STD'); ret.push('CG'); ret.push('MG'); ret.push('A-STD'); }
	if (width <= eight && height <= six) { ret.push('AG'); ret.push('STD'); ret.push('CG'); ret.push('MG'); ret.push('A-STD'); }
	// calcs for four by eight
	if (height <= four && width <= eight) { ret.push('PG'); ret.push('BG'); ret.push('A-BG'); ret.push('A-CG'); ret.push('SG'); }
	if (width <= four && height <= eight) { ret.push('PG'); ret.push('BG'); ret.push('A-BG'); ret.push('A-CG'); ret.push('SG'); }
	// strip duplicates
	removeDuplicates(ret);
	console.log((JSON.stringify(ret)));
	// return array of available treatments for this combination of height and width
	return ret;
}

// remove duplicate members from target array
function removeDuplicates(target_array)
{
    target_array.sort();
    var i = 1;
    while(i < target_array.length)
    {   
        if(target_array[i] == target_array[i+1])
        {   
        target_array[i] = undefined;
           target_array.sort();
           target_array.pop();
           i = 0;
        }
        else
        {
            i += 1;
        }
    }
    return true;
}

/* finis */
