/**
 * jQuery calendar - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */
 
(function($, undefined) {
	
	var Month = function(year, month, currentDay) {
		this.year = year ;
		this.month = month;
		
		if(month < 0 ) {
			this.year -=1;
			this.month = 11;
		}
		
		if(month > 11) {
			this.year +=1;
			this.month = 0;
		}
		
		this.isLeapYear = this.getLeapYear();
		this.Months = this.getMonths();
		var firstDay = new Date(this.year, this.month, 1);
		this.days = this.getDays(this.month);
		
		this.firstWeekdayIndex = firstDay.getDay();
		if(this.firstWeekdayIndex === 0)
			this.firstWeekdayIndex = 7;
		if(currentDay)
			this.currentDay = currentDay;
		
		this.previousMonthLastDay = this.getPreviousMonthLastDay(this.month);
		this.firstWeekday = this.firstWeekdayIndex;
		this.lastWeekday = this.getLastWeekday();
	}
	
	
	Month.prototype = {
		constructor: Month,
		
		getMonth: function(index, Months) {
			if (index <= 12 && index >= -1) {
				if (index == 12) {
					this.yearChanged = 1;
					this.monthIndex = 0;
					return Months[0].name;
				} 
				else if (index == -1) {
					this.yearChanged = -1;
					this.monthIndex = 11;
					return Months[11].name;
				} 
				else {
					this.monthIndex = index;
					return Months[index].name;
				}
			} 
			else {
				this.monthIndex = -42;	//Invalid monthIndex
				return 'Invalid';
			}
		},
		
		getMonths: function() {
			return [31, (this.isLeapYear === true) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		},
		
		getDays: function(month) {
			if (month >= 0 && month < 12)
				return this.Months[month];
		},
		
		getWeekday: function(index, Weekdays) {
			if (index <= 7 && index >= -1) {
				if(index == 7) {
					return Weekdays[0];
				} 
				else if(index == -1) {
					return Weekdays[6];
				} 
				else {
					return Weekdays[index];
				}
			} 
			else {
				return 'Invalid';
			}
		},
		
		getFirstWeekdayIndex: function(Weekdays) {
			for (var i = 0; i < Weekdays.length; i++) {
				if (Weekdays[i] ===  this.firstWeekday) {
					return i;
				}
			}
			return -1;
		},
		
		getPreviousMonthLastDay: function(month) {
			var lastMonth = month - 1;
			return this.Months[lastMonth < 0 ? 11 : lastMonth];
		},
		
		getLastWeekday: function(Weekdays) {
			var lastweekday = this.firstWeekday;
			lastweekday += this.days % 7;
			lastweekday = lastweekday % 7;
			return lastweekday;
		},
		
		
		getLeapYear: function() {
			if (this.year % 4 === 0) {
				if (this.year % 100 !== 0) {
					return true;
				} 
				else {
					return false;
				}
			} 
			else {
				return false;
			}
		},
		
		renderDays: function() {
			var padding = this.firstWeekdayIndex;
			var lastMonthDay = this.previousMonthLastDay - padding + 1;
			var firstMonthDay = 1;
			var days = 1;
			var html = "<table class='lily-days-table'>";
			for (var i = 1; i <= 6; i++) {
				html += "<tr>";
				for(var j = 1; j <= 7; j++) {
					if (padding-- > 0) {
						html += "<td class='off-month' data-content='prev'>" + (lastMonthDay++) + "</td>";
						continue;
					}
					if (days > this.days) {
						html += "<td class='off-month' data-content='next'>" + (firstMonthDay++) + "</td>";
						continue;
					}
					if (days == this.currentDay) {
						html += "<td class='today' data-content='" + days + "'>" + (days++) + "</td>";
					} 
					else {
						html += "<td class='on-month' data-content='" + days + "'>" + (days++) + "</td>";
					}
				}
				html += "</tr>";
			}
			html += "</table>";
			return html;
		}
	}
	
	var Calendar = function ( element, options ) {
		
		this.init('', element, options);
	}
	
	Calendar.prototype = {
		constructor: Calendar,
		
		localization: { // Default regional settings
			closeText: 'Done', // Display text for close link
			prevText: 'Prev', // Display text for previous month link
			nextText: 'Next', // Display text for next month link
			currentText: 'Today', // Display text for current month link
			monthNames: ['January','February','March','April','May','June',
				'July','August','September','October','November','December'],
			monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
			dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
			dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
			weekHeader: 'Wk', // Column header for week of the year
			dateFormat: 'mm/dd/yy', // See format options on parseDate
			firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
			isRTL: false, // True if right-to-left language, false if left-to-right
			showMonthAfterYear: false, // True if the year select precedes month, false for month then year
			yearSuffix: '' // Additional text to append to the year in the month headers
		},
		
		init: function ( type, element, options ) {
			this.type = type;
			this.$element = $(element);
			this.options = options;
			var self = this;
			
			this.now = new Date();
			this.year = this.options.year ? this.options.year : this.now.getFullYear();
			
			this.currentMonth = this.options.month ? this.options.month : this.now.getMonth();
			
			
			var calendarObj = $(this.renderCalendar());
			calendarObj.height(this.options.headHeight);
			
			$('.prev', calendarObj).bind('click.calendar', function(event) {
				return self.prevMonth();
			});
			
			$('.next', calendarObj).bind('click.calendar', function(event) {
				return self.nextMonth();
			});
			
			var month = new Month(this.year, this.currentMonth, this.now.getDate());
			
			var width = this.$element.width();
			var height = this.$element.height() - this.options.headHeight;
			
			this.currentIndex = 0;
			
			this.monthOjb = $("<div class='lily-days-container'>" + month.renderDays() + "</div>");
			
			$('td', this.monthOjb).bind('click.calendar-day', function(event) {
				return self.dayClick(event);
			});
			
			this.$element.append(calendarObj);
			this.$element.append(this.monthOjb);
		},
		
		dayClick: function(event) {
			var day = $(event.target).attr('data-content');
			switch(day) {
				case 'next':
					this.nextMonth();
					break;
				case 'prev':
					this.prevMonth();
					break;
				default:
					if(this.options.selectFun) {
						var date = new Date(this.year, this.currentMonth, day);
						this.options.selectFun.apply(this.options.target, [date]);
					}
			}
		},
		
		prevMonth: function() {
			var self = this;
			this.currentMonth -= 1;
			
			if(this.currentMonth < 0 ) {
				this.year -=1;
				this.currentMonth = 11;
			}
			this.updateCalendarHead();
			
			var currentDay = null
			if(this.currentMonth == this.now.getMonth())
				currentDay = this.now.getDate()
			var month = new Month(this.year, this.currentMonth , currentDay);
			
			
			var oldMonthObj = this.monthOjb;
			this.monthOjb = $("<div class='lily-days-container'>" + month.renderDays() + "</div>");
			
			$('td', this.monthOjb).bind('click.calendar-day', function(event) {
				return self.dayClick(event);
			});
			
			this.$element.append(this.monthOjb);
				
			oldMonthObj.remove();
		},
		
		nextMonth: function() {
			var self = this;
			this.currentMonth += 1;
			
			if(this.currentMonth > 11) {
				this.year +=1;
				this.currentMonth = 0;
			}
			
			this.updateCalendarHead();
			
			var currentDay = null
			if(this.currentMonth == this.now.getMonth())
				currentDay = this.now.getDate()
			var month = new Month(this.year, this.currentMonth , currentDay);
			
			var oldMonthObj = this.monthOjb;
			this.monthOjb = $("<div class='lily-days-container'>" + month.renderDays() + "</div>");
			
			$('td', this.monthOjb).bind('click.calendar-day', function(event) {
				return self.dayClick(event);
			});
			
			this.$element.append(this.monthOjb);
				
			oldMonthObj.remove();
		},
		
		buildCalendarHead: function() {
			var monthHtml ;
			if(this.localization.showMonthAfterYear)
				monthHtml = this.year + this.localization.yearSuffix + this.localization.monthNames[this.currentMonth];
			else
				monthHtml = this.localization.monthNames[this.currentMonth] + ' ' + this.year + this.localization.yearSuffix;
			return monthHtml;
		},
		
		updateCalendarHead: function() {
			var monthHtml = this.buildCalendarHead();
			var headObj = $('.lily-datepicker-title', this.$element);
			headObj.text(monthHtml);
		},
		
		renderCalendar: function () {
			//Template for Calendar
			var monthHtml = this.buildCalendarHead();
			
			var html = "<div class='lily-calendar-head'><div class='lily-calendar-area'><a class='prev'></a><div class='lily-datepicker-title'>" +
				monthHtml + "</div><a class='next'></a></div><div class='lily-week-area'><table class='lily-week-head'><tr>";
			for(var i = 0; i < 	this.localization.dayNamesMin.length; ++i) {
				html += "<td>" + this.localization.dayNamesMin[i] + "</td>";
			}
			html += "</tr></table></div></div>";
			return html;
		}
	}
	
	$.fn.calendar = function ( option ) {
    	return this.each(function () {
			var $this = $(this), 
				data = $this.data('calendar'), 
				options = $.extend({}, $.fn.calendar.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) 
      			$this.data('calendar', (data = new Calendar(this, options)));
      		if (typeof option == 'string') 
      			data[option]();
    	});
  	}

  	$.fn.calendar.Constructor = Calendar;
  	
  	$.fn.calendar.defaults = {
  		headHeight: 37,
  		target: null,
  		selectFun: null
  	}
})(jQuery);
