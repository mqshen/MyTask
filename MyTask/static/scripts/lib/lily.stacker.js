!function($) {

	"use strict"; // jshint ;_;

	/*
	 * BUTTON PUBLIC CLASS DEFINITION ==============================
	 */

	var Stacker = function(element, options) {
		this.$element = $(element);
        this.options = options;
        this.pathArray = [];
        this.elementArray = [];
        var self = this;
        $("a[href]").live("click", function(e) {self.didClickLink(e)});
        $(window).bind('popstate', function(e) { self.popstate(e)});  
        this.path = window.location.pathname;
        this.html = this.$element.find('.container')[0];
        console.log(this.html);
	}

    Stacker.DEFAULTS = {
        el: '<div class="container stack_container" style="width: 960px;"><div class="panel stub sheet loading" ></div></div>',
        notFound: '<div class="panel sheet error not_found" style="width: 960px;"><header><h1>Oops!</h1>  </header>  <div class="sheet_body">    <h2>We can\'t find that page</h2>    <p>The link you clicked doesn\'t look quite right. Check to make <br>sure the spelling, capitalization, etc. are exactly right.</p>    <p><a href="#" onclick="history.back(); return false" class="button">&larr; Back to the previous page</a></p>  </div></div>',
        internalError: '<div class="panel sheet error internal_server_error" style="width: 960px;"><header><h1>Oops! Something isn\'t working.</h1>  </header>  <div class="sheet_body"><h2>This is our fault, not yours. We\'re sorry.</h2><p>It\'s likely this is a temporary glitch that will be fixed within <br>a few minutes. If you continue to see this error:</p><ul><li><a href="#" class="decorated">Tell us about this problem</a></li>      </ul></div>'
    }

	Stacker.prototype.load = function () {
        this.$element.addClass("loading");
        var self = this;
        $.ajax({
            url: this.path,
            data: {from_workspace: 1},
            dataType: "html",
            beforeSend: function (e) {
                return e.stacker = true;
            },
            complete: function (e) {
                var n, r;
                r = e.status, 
                n = e.responseText, 
                self.$element.removeClass("loading");
                if (!self.canBeReplaced()) 
                    return;
                return r === 200 || r === 304 ? 
                    self.handleSuccessResponse(r, n):
                    r > 0 && self.handleErrorResponse(r, n), 
                    self.status = r
            }
        });
        if (this.canBeReplaced()) {
            if("pushState" in window.history ) {
                window.history.pushState("string", null, this.path);
            }
            this.replace(this.options.el);
        }
    } 


    Stacker.prototype.replace = function (html) {
        this.$element.empty();
        this.html = html;
        var $html = $(html);
        var title = $html.find("title").text()
        if(title)
            $(document).attr("title", title);
        this.$element.append($html);
    } 

    Stacker.prototype.popstate = function(e) {
        if(this.pathArray.length == 0) {
            return;
        }
        this.pathArray.pop()
        var element = this.elementArray.pop()
        this.replace(element);
    }
    
    Stacker.prototype.statechange = function(e) {
        consoel.log("statechange");
        e.preventDefault(); 
    }

    
    Stacker.prototype.handleSuccessResponse = function (e, t) {
        return this.replace(t), 
            this.hasLoaded = true
    }

    Stacker.prototype.handleErrorResponse = function (e, t) {
        var n;
        return e === 404 ? 
            n = this.options.notFound : 
            n = this.options.internalError ,
            this.replace(n) 
    } 


    Stacker.prototype.canBeReplaced = function () {
        return true;
    }

    Stacker.prototype.didClickLink = function (e) {
        if (this.matchLinkClickEvent(e)) {
            var t = $(e.target);
            t = t.is('a') ? t : t.closest('a');
            if(this.path) {
                this.pathArray.push(this.path);
                this.elementArray.push(this.html);
            }
            this.path = t.attr("href");
            this.load(); 
            e.preventDefault(); 
            e.stopPropagation();
        }
        else if(this.needGoBack(e)){
            this.popstate();
            e.preventDefault(); 
            e.stopPropagation();
        }
    } 

    Stacker.prototype.matchLinkClickEvent = function (e) {
        var t = $(e.target);
        t = t.is('a') ? t : t.closest('a');
        if(t.attr("data-behavior") == "cancel" || t.attr("href") == "javascript:;" || t.attr("href") == "#" ) 
            return false;
        return this.isSameOrigin(t) && this.isStandardClick(e);
    } 

    Stacker.prototype.needGoBack = function (e) {
        var t = $(e.target);
        t = t.is('a') ? t : t.closest('a');
        if(t.attr("data-behavior") == "cancel" )
            return true;
    } 

    Stacker.prototype.isSameOrigin = function (e) {
        var t, n;
        return t = document.createElement("a"), 
            t.href = e, 
            n = t.href.split("/", 3).join("/"), 
            !window.location.href.indexOf(n)
    }

    Stacker.prototype.isStandardClick = function (e) {
        return e.isTrigger || 
            e.which === 1 && 
            !e.metaKey && 
            !e.ctrlKey
    }

    $.fn.stacker = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('stacker')
            var options = $.extend({}, Stacker.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) 
                $this.data('stacker', (data = new Stacker(this, options)))
            if (typeof option == 'string') 
                data[option]()
        })
    }

 
}(window.jQuery);
