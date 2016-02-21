$(document).ready(function ()
{
    if ( $('#flash_data').length > 0 )
    {
        $('#flash_data').delay(2000).animate({opacity: 0}, 750, function () {
            $(this).slideUp(1000, function () {
                $(this).remove();
            });
        });
    }

    $('#remove_signature').click(function (e)
    {
        e.preventDefault();

        $.ajax({
            url: document.URL.replace('/edit', '')+"/remove_pic/signature"
        }).done(function () {
            $('#sig_pic').remove();
            $('#remove_signature').remove();
        });
    });

    $('#remove_logo').click(function (e)
    {
        e.preventDefault();

        $.ajax({
            url: document.URL.replace('/edit', '')+"/remove_pic/logo"
        }).done(function () {
            $('#logo_pic').remove();
            $('#remove_logo').remove();
        });
    });

    if ( !("placeholder" in document.createElement("input")) ) {
        $("input[placeholder], textarea[placeholder]").each(function() {
            var val = $(this).attr("placeholder");
            if ( this.value == "" ) {
                this.value = val;
            }
            $(this).focus(function() {
                if ( this.value == val ) {
                    this.value = "";
                }
            }).blur(function() {
                if ( $.trim(this.value) == "" ) {
                    this.value = val;
                }
            })
        });
 
        // Clear default placeholder values on form submit
        $('form').submit(function() {
            $(this).find("input[placeholder], textarea[placeholder]").each(function() {
                if ( this.value == $(this).attr("placeholder") ) {
                    this.value = "";
                }
            });
        });
    }

});
