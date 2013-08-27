!function(){

    "use strict"
    
    var TimeFormater = function(options) {
        this.options = $.extend({}, $.fn.time.defaults, options)
        this.init()
    }

    TimeFormater.prototype = {
        constructor: TimeFormater,
    
        init: function() {
            this.pattern = /^\s*(\d{1,2})(?:[.:]?([0-5]\d?)?)?(?:[.:]?([0-5]\d?)?)?(?:\s*([ap])(?:\.?m\.?)?|\s*[h]?)?\s*$/i
        },
        normalize: function(e, t, n) {
            var r, i, s;
            this.hour = e != null ? e : 0, 
            this.minute = t != null ? t : 0, 
            this.second = n != null ? n : 0;
            if (!(0 <= (r = this.hour) && 
                r <= 23 && 
                0 <= (i = this.minute) && 
                i <= 59 && 0 <= (s = this.second) && 
                s <= 59)) 
                throw Error("invalid time (" + this.hour + ", " + this.minute + ", " + this.second + ")");
            this.ampm = this.hour < 12 ? "am" : "pm", 
            this.hour === 0 ? this.hour12 = 12 : this.hour > 12 ? this.hour12 = this.hour - 12 : this.hour12 = this.hour
        },
        parse: function (e) {
            var t, n, r, i, s, o, u, a, f;
            a = "" + e;
            if (e instanceof Date) 
                return r = e.getHours(), s = e.getMinutes(), u = e.getSeconds(), 
                this.normalize(r, s, u);
            else if (i = a.match(this.pattern)) 
                f = i[0], 
                r = i[1], 
                s = i[2], 
                u = i[3], 
                n = i[4], 
                r = parseInt(r, 10), 
                s = parseInt(s != null ? s : "0", 10), 
                u = parseInt(u != null ? u : "0", 10), 
                t = n != null ? n.match(/a/i) : void 0, 
                o = n != null ? n.match(/p/i) : void 0, 
                1 <= r && r <= 11 && o && (r += 12), 
                r === 12 && t && (r = 0), 
                this.normalize(r, s, u);
            else
                throw Error("invalid time (" + r + ", " + s + ", " + u + ")");
            return this.toString()
        },
        toString: function () {
            var n = [this.format(this.minute), 
                this.format(this.second)]
            this.options.short && this.second === 0 && (n.pop(), this.minute === 0 && n.pop())
            n.length && (n = ":" + n.join(":"))
            return this.options[12] ? "" + this.hour12 + n + this.ampm : "" + this.hour + n
        },
        format: function(e) {
            return e < 10 ? "0" + e : "" + e
        }
    }

    var Time = function(element, options) {
        this.$element= $(element)
        this.options = $.extend({}, $.fn.time.defaults, options)
        this.init()
    }

    
    Time.prototype = {
        constructor: Time,

        init: function() {
            var self = this
            this.$element.blur(function() {
                try {
                    var formatedTime = $.lily.timFormater.parse(self.$element.val())
                    self.$element.val(formatedTime)
                } 
                catch (t) {
                    return false 
                }
            })
        },

    }

    $.fn.time = function ( option ) {
       return this.each(function () {
           var $this = $(this), 
               data = $this.data('time'), 
               options = typeof option == 'object' && option;
           if (!data) {
               $this.data('time', (data = new Time(this, options)));
           }
       });
    }

    $.fn.Time = Time

    $.fn.time.defaults = {
        12: !0,
        "short": !0
    }
    $.fn.time.Constructor =  Time
    $.lily.timFormater = new TimeFormater( $.fn.time.defaults )

}(window.jQuery)

