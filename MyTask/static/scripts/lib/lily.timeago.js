!function($) {

	"use strict"; // jshint ;_;

	var Timeago = function(element, options) {
        this.$element = $(element)
		this.options = $.extend({}, $.fn.timeago.defaults, options)
        this.init()
    }

	Timeago.prototype = {
		constructor: Timeago,

		localization: { // Default regional settings
            suffixAgo: "之前",
            suffixFromNow: "从现在开始",
            seconds: "刚刚",
            minute: "一分钟前",
            minutes: "%d分钟前",
            hour: "一小时前",
            hours: "%d 小时前",
            day: "一天前",
            days: "%d天前",
            month: "一个月前",
            months: "%d月前",
            year: "一年前",
            years: "%d年前"
        },

        init: function() {
            var thisTime = this.$element.attr("data-time")
            if(!thisTime)
                return
            this.time = $.lily.format.parseDate(thisTime, "yyyy-mm-dd hh:mi:ss")
            this.update()
            var refresh_el = $.proxy(refresh, this);
            function refresh() {
                $('time.timeago').timeago()
            }

            if(!$.lily.timeagoRefresh) {
                $.lily.timeagoRefresh = true
                setInterval(refresh_el, this.options.refreshMillis);
            }
        },
        update: function() {
            var interval = new Date().getTime() - this.time
            var seconds = Math.abs(interval) / 1000
            var minutes = seconds / 60
            var hours = minutes / 60
            var days = hours / 24
            var years = days / 365

            function substitute(string, value) {
                return string.replace(/%d/i, value)
            }
            var $l = this.localization

            var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
                seconds < 90 && substitute($l.minute, 1) ||
                minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
                minutes < 90 && substitute($l.hour, 1) ||
                hours < 24 && substitute($l.hours, Math.round(hours)) ||
                hours < 42 && substitute($l.day, 1) ||
                days < 30 && substitute($l.days, Math.round(days)) ||
                days < 45 && substitute($l.month, 1) ||
                days < 365 && substitute($l.months, Math.round(days / 30)) ||
                years < 1.5 && substitute($l.year, 1) ||
                substitute($l.years, Math.round(years))

            this.$element.text(words)
        }
        
    }

	$.fn.timeago = function(option) {
		return this
				.each(function() {
					var $this = $(this), data = $this.data('timeago'), options = typeof option == 'object' && option
					if (!data)
						$this.data('timeago', (data = new Timeago(this, options)))
                    else
                        data.update()
				})
	}


	$.fn.timeago.defaults = {
        refreshMillis: 60000
	}

	$.fn.timeago.Constructor = Timeago 

}(window.jQuery);
