/*
 *This is a very simplified version of a validation system just to allow the page to be a little more responsive
 *usages are minimal for the time being, just add an attribute to the html input element called validate and set to simple rules
 * Current rules are 'presence', 'length', 'numeric', and 'email'
 * to validate presence... <input type='text' class='val' validate='presence' value='' />
 * to validate length... <input type='text' class='val' validate='lenght|>5' value='' /> // that will make sure the minimum length of 5 chars
 * to validate numeric... <input type='text' class='val' validate='numeric' value='' />
 * to validate email... <input type='text' class='val' validate='email' value='' />
 */

var simpleValidation = {
    timer: null,
    emailUsed : '<p class="error failed">That Email Address Is Currently In Use</p>',
    passwordMisMatch : '<p class="error failed">Passwords Must Match</p>',
    errorsContainer : function() {
        return $('#hidden-errors');
    },
    baseUrl: null,
    reply: null,
    emailVerified : false,
    emailNeedsValidating: true,
    requirePass : true,
    loanOfficer : '.required',
    buyer : '.val',
    realtor : '.required',
    admin : '.required',
    use : null,
    failedItems : [],
    setType : function(type) {
        this.use = this[type];
    },
    numeric : function(input) {
        return !isNaN(parseFloat(input)) && isFinite(input);
    },
    email : function(input) {
        return /^$|^[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input);
    },
    presence : function(input) {
        return (input.length >= 1);
    },
    stripNonNumeric : function(input) {
        return input.replace(/[^0-9]/g, '');
    },
    getNonNumeric : function(input) {
        return /\D+/g.exec(input);
    },
    validate : function(item) {
        if(!this[$(item).attr('validate')]($(item).val())) {
            if(typeof item.attr('onFail') != 'undefined') {
                var that = this;
                var value = this[item.attr('onFail')](item.val());
                item.val(value);
                this.timer = setTimeout(function() {
                    that.validate(item);
                }, 250);
            }

            this.showFail(item);
            return false;
        } else {
            if(typeof item.attr('forceequals') != 'undefined') {
                if(item.val() !== $("#" + item.attr('forceequals')).val()) {
                    this.showFail(item);
                    this.showFail($("#" + item.attr('forceequals')));
                    this.errorsContainer().html(this.passwordMisMatch).show();
                    return false;
                }
            }
            clearTimeout(this.timer);
            this.showSuccess(item);
            return true;
        }
    },
    showFail : function(item) {
        item.removeClass('success').addClass('error')
    },
    showSuccess: function(item) {
        item.removeClass('error').addClass('success');
    },
    validateUniqueEmail : function(email) {
        if(this.emailNeedsValidating) {
            var that = this;
            $.ajax({
                async: false,
                type: "POST",
                url: that.baseUrl + 'users/validate_unique_email',
                dataType: 'json',
                data: 'email=' + email,
                success: function(msg) {
                    that.reply = msg;
                }
            })
            return this.reply.success;
        } else {
            return true;
        }
    },
    showFailed : function() {
        var that = this,
            html = '';
        this.errorsContainer().html('');
        $.each(that.failedItems, function() {
            html += '<p class="error failed">' + $(this).attr('id').replace('_', ' ') + ' Cannot be blank</p>';
        })
        this.errorsContainer().html(html).show();
    },
    hideFailed : function() {
        this.failedItems.length = 0;
        this.errorsContainer().html('').hide();
    },
    formCanSubmit : function() {
        var that = this,
            submit = true;
        this.failedItems.length = 0;
        $.each($(that.use), function() {
            console.log($(this));
            if(!that.validate($(this))) {
                that.failedItems.push($(this));
                submit = false;
            }
        })
        if(this.emailNeedsValidating) {
            if(!this.emailVerified) {
                if(this.validateUniqueEmail($("#email").val())) {
                    this.emailVerified = true;
                } else {
                    submit = false;
                }
            }
        }
        return submit;
    }

}

var formFiller = {
    fields : [],
    selectFields : [],
    textAreas : [],
    associations: {},
    alphaChars : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    numericChars : "0123456789",
    emailChars : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    length : 7,
    searchLength : null,
    searchType : null,
    foundText : null,
    getInputFields : function() {
        return $('input');
    },
    setupInputFields : function() {
        var that = this;
        $.each($('input:not([type="file"])'), function() {
            that.fields.push($(this));
        })
    },
    setupSelectFields : function() {
        var that = this;
        $.each($('select'), function() {
            that.selectFields.push($(this));
        })
    },
    setupTextAreas : function() {
        var that = this;
        $.each($('textarea'), function() {
            that.textAreas.push($(this));
        })
    },
    getSelectOptions : function(ele) {
        var opts = ele.children('option');
        var length = opts.length;
        var select = Math.floor(Math.random() * length);
        if(select == 0) {
            select = 1;
        }
        return $(opts[select]).attr('value');
    },
    fillOutSelects : function() {
        var that = this,
            selectedOption;
        $.each(that.selectFields, function() {
            if(typeof $(this).attr('default') != 'undefined') {
                selectedOption = $(this).attr('default');
            } else {
                selectedOption = that.getSelectOptions($(this));
            }
            $(this).val(selectedOption + '');
        })

    },
    fillOutTextAreas : function() {
        var that = this;
        $.each(that.textAreas, function() {
            that.fillOutField($(this));
        })
    },
    fillOutForm: function() {
        this.setupInputFields();
        this.setupSelectFields();
        this.setupTextAreas();
        this.fillOutSelects();
        this.fillOutInputs();
        this.fillOutTextAreas();
    },
    getRandomCharacters : function(obj) {
        this.searchLength = (typeof obj.searchLength != 'undefined') ? obj.searchLength : this.length;
        this.searchType = (typeof obj.searchType != 'undefined') ? obj.searchType : 'alpha';
        this.foundText = '';
        if(this.searchType == 'address') {
            this.foundText = this.getRandomCharacters({searchType:'numeric', searchLength: 5});
            this.foundText += ' ';
            this.foundText += this.getRandomCharacters({searchType: 'alpha', searchLength: 12});
            this.foundText += ' st.';
        } else {
            for(var i = 0; i < this.searchLength; i++) {
                this.foundText += this[this.searchType + 'Chars'].charAt(Math.floor(Math.random() * this[this.searchType + 'Chars'].length));
            }
            if(this.searchType == 'email') {
                this.foundText += '@'+this.getRandomCharacters({searchLength:5, searchType:'alpha'}) + '.com';
            }
        }
        return this.foundText;
    },
    fillOutInputs : function() {
        var that = this;
        $.each(that.fields, function() {
            that.fillOutField($(this));
        })
    },
    fillOutField : function(ele) {
        ele.val(this.getRandomCharacters({
            searchLength : ele.attr('min-length'),
            searchType : ele.attr('char-type')
        }))
    }
}
