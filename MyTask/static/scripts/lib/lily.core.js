/**
 * jQuery core - v1.0
 * auth: shenmq
 * E-mail: mqshen@126.com
 * website: shenmq.github.com
 */

(function( $, undefined ) {
	
	var matched, browser;

	// Use of jQuery.browser is frowned upon.
	// More details: http://api.jquery.com/jQuery.browser
	// jQuery.uaMatch maintained for back-compat
	jQuery.uaMatch = function( ua ) {
	    ua = ua.toLowerCase();

	    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
	        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
	        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
	        /(msie) ([\w.]+)/.exec( ua ) ||
	        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
	        [];

	    return {
	        browser: match[ 1 ] || "",
	        version: match[ 2 ] || "0"
	    };
	};

	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
	    browser[ matched.browser ] = true;
	    browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
	    browser.webkit = true;
	} else if ( browser.webkit ) {
	    browser.safari = true;
	}

	jQuery.browser = browser;

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.lily = $.lily || {};
if ( $.lily.version ) {
	return;
}

jQuery.fn.extend({
	bind: function( types, data, fn ) {
		this.off( types, null, fn );
		return this.on( types, null, data, fn );
	}
});

$.extend( $.lily, {
	minInterval: 1000,
    browser: function(browser) {
		var ua = navigator.userAgent.toLowerCase();
		var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

		if (browser == 'version')
		{
			return match[2];
		}

		if (browser == 'webkit')
		{
			return (match[1] == 'chrome' || match[1] == 'webkit');
		}
		return match[1] == browser;
	},
    oldIE: function() {
			if ($.lily.browser('msie') && parseInt($.lily.browser('version'), 10) < 9) {
				return true;
			}
			return false;
	},
	ajax: function(options) {
		//console.log(options);
		//try{initAutoOutTimer();}catch(e){};
		var startTime = (new Date()).getTime()
		var option = $.extend(options, {cache:false, dataType:'json',traditional: true});
		if(option.data) {
			$.extend(option.data, $.lily.collectCsrfData())
		}
		else {
			option.data =  $.lily.collectCsrfData()
		}

		function doResponse(data) {

			if(data.returnCode != '0' && data.returnCode != '000000') {
				if(options.transactionFailed) {
					alert(data.returnCode);
				}
			}
			else {
				var currentTime = (new Date()).getTime();
				var timeInterval = currentTime - startTime ;
				if(timeInterval < $.lily.minInterval) {
					setTimeout(function() {options.processResponse(data) }, $.lily.minInterval - timeInterval);
				}
				else
					options.processResponse(data)
                
			}
		}
	    if(options.processResponse) {	
    		$.extend(options, {success: doResponse})
        }
		
		return $.ajax(option);
	},
	
	formatPostData: function(data) {
		$.extend(data, $.lily.collectCsrfData())
	},
	
	collectCsrfData: function() {
		var data = {}
        $('#csrfForm > input').each(function(){
        	data[this.name] = this.value
        });
		return data; 
	},
	collectCsrfDataStr: function() {
		var data = ""
        $('#csrfForm > input').each(function(){
        	data += '' + this.name + '=' + this.value +''
        });
		return data; 
	},
    generateUID : function() {
        var guid = "";
        for (var i = 1; i <= 32; i++){
            var n = Math.floor(Math.random()*16.0).toString(16);
            guid += n;
            if((i==8)||(i==12)||(i==16)||(i==20))
                guid += "-";
        }
        return guid;
    },

    changeData: function($targetElement, data) {
        $('[data-toggle=remote],[data-toggle=datepick]' , $targetElement).each(function () {
    		var $this = $(this)
            var name = $this.attr("name")
            var value = data[name]
            if(value === undefined || value === 'null')
                return
            if(this.nodeName !== 'INPUT' && this.nodeName !== 'SELECT')
                $this.text(value)
            else
                $this.val(value)
    	})
 
    },
    collectRequestData: function(sourceElement) {
        var orginRequestData = {}

        $('[data-toggle=remote],[data-toggle=datepick]' , sourceElement).each(function () {
    		var $this = $(this)
            if($this.attr("type") == "checkbox" && !$this.attr("checked"))
                return
            var value = "";
            if(this.nodeName !== 'INPUT' && this.nodeName !== 'SELECT' && this.nodeName != 'TEXTAREA') {
                value = $this.text()
            }
            else {
                value = $this.val().trim()
            }
            if(value && !$.lily.format.isEmpty(value) ){
                var name = $this.attr("name")
                if(name.endsWith("[]")){
                    name = name.substring(0, name.length - 2)
        	        if(orginRequestData[name]) {
                    	orginRequestData[name].push(value)
        	        }
        	        else {
        	        	orginRequestData[name] = []
        	        	orginRequestData[name].push(value)
        	        }
                }
                else {
                    orginRequestData[name] = value
                }
            }
    	})

        $('[data-toggle="select"]', sourceElement).each(function() {
        	var $this = $(this)
        	var orginStatues = $(this).attr("data-orgin-statues")
        	var selected = false;
        	if(orginStatues == "selected") {
        		if($this.hasClass("selected"))
        			return
        		selected = false;
        	}
        	else {
        		if(!$this.hasClass("selected"))
        			return
        		selected = true;
        	}
        	var contentValue = $this.attr("data-content")
        	var requestName = $this.attr("name")
        	if(!selected)
        		requestName += "Del"
        	
            var $parent = $this.closest('[data-toggle="select-radio"]')

            if($parent.length > 0) {
            	orginRequestData[requestName] = contentValue
                return
            } 
        	if(orginRequestData[requestName]) {
            	orginRequestData[requestName].push(contentValue)
        	}
        	else {
        		orginRequestData[requestName] = []
        		orginRequestData[requestName].push(contentValue)
        	}
        })
        return orginRequestData
    },
    showWait : function(target) {
    	var waitObj = $('<a class="wait" href="javascript:;">nbsp;</a>');

    	waitObj.css({
    		width: target.width(),
    		height: target.height(),
    		float: target.css("float"),
            padding: target.css("padding"),
    		margin: target.css("margin")
    	})
        if(target.css("display") == 'inline-block')
            waitObj.css({
                display: target.css("display"),
                "vertical-align": "top"
            })
    	target.hide();
    	waitObj.insertAfter(target);
    },
    hideWait: function(target) {
    	target.next('.wait').remove();
    	target.css("display", "")
    },

    fillHtml: function($obj, data) {
        var name = $obj.attr("name")
        if(!name)
            return 
        var dateType = "text"
        if(name.endsWith("Date")){
            dateType = "date"
            name = name.substring(0, name.length - 4)
        }
        var nameArray = name.split(".")
        var value = data
        for(var i in nameArray){
            value = value[nameArray[i]]
            if(!value)
                break
        }
        if(!value)
            return
        if(dateType == "date")
            value = value.substring(0, 10)
        if(value)
		    $obj.html(value)
    },

    showWarring: function($obj, highlightColor, duration) {
        var highlightBg = highlightColor || "#FFFF9C"
        var animateMs = duration || 1000 // edit is here
        var originalBg = $obj.css("background-color")
        if (!originalBg || originalBg == highlightBg)
            originalBg = "#FFFFFF"; // default to white
        $obj.css("backgroundColor", highlightBg)
            .animate({ backgroundColor: originalBg }, animateMs, null, function () {
                $obj.css("backgroundColor", originalBg); 
            });
    },

    hexDigits: new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"), 

    rgb2hex: function(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if(rgb && rgb.length > 2)
            return $.lily.hex(rgb[1]) + $.lily.hex(rgb[2]) + $.lily.hex(rgb[3]);
    },

    hex: function(x) {
        return isNaN(x) ? "00" : $.lily.hexDigits[(x - x % 16) / 16] + $.lily.hexDigits[x % 16];
    }
});
})( jQuery ); 
