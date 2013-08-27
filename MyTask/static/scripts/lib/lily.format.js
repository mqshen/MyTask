/**
 * jQuery format - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 *
 */
 
(function( $, undefined ) {
	if(!Function.bind) {

		Function.prototype.update = function(array, args) {
			var arrayLength = array.length, length = args.length;
		    while (length--) 
		    	array[arrayLength + length] = args[length];
		    return array;
		}
		Function.prototype.merge = function(array, args) {
		    array = Array.prototype.slice.call(array, 0);
		    return Function.update(array, args);
		}
		
		Function.prototype.bind = function(context) {
			if (arguments.length < 2 && typeof arguments[0] === "undefined") return this;
			var __method = this, args = Array.prototype.slice.call(arguments, 1);
			return function() {
				var a = Function.merge(args, arguments);
				return __method.apply(context, a);
			}
		}
	}

	/**
	 * 连续count个当前字符串连接
	 * @param {int} count
	 * @returns {string} 
	 */
	String.prototype.times = function(count) {
    	return count < 1 ? '' : new Array(count + 1).join(this);
  	}

    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    }
	
	/**
	 * 字符串左补0到指定位数
	 * @param {int} width
	 * @returns {string} 
	 */
	String.prototype.leftPadZero = function( width ) {
		var pad = width - this.length;
		if ( pad > 0 ){
			return ("0".times(pad) + this); 
		}else{
			return this;	
		}
	};
	
	String.prototype.blank = function() {
	    return /^\s*$/.test(this);
	}
	
	/**
	 * 将日期对象根据指定的格式格式化为字符串
	 * @param {string} format 日期格式
	 * @returns {string}
	 */
	Date.prototype.format = function( format ){
		if ( !format ){
			format = $.lily.format.DATE_FORMAT;
		}
		return format.replace(
			$.lily.format.REGEXP_DATE,
			function(str){
				switch ( str.toLowerCase() ){
					case 'yyyy': return this.getFullYear();
					case 'mm': return (this.getMonth() + 1).toString().leftPadZero(2);
					case 'dd': return this.getDate().toString().leftPadZero(2);
					case 'hh': return this.getHours().toString().leftPadZero(2);
					case 'mi': return this.getMinutes().toString().leftPadZero(2);
					case 'ss': return this.getSeconds().toString().leftPadZero(2);
					case 'ms': return this.getMilliseconds().toString().leftPadZero(3);
				}
			}.bind(this)
		);
	};
	
	/**
	 * 比较日期是否为同一天
	 * @param {Date} compareDate 要比较的日期
	 * @returns {boolean} 
	 */
	Date.prototype.isSameDay = function( compareDate ) {
        if(typeof compareDate != 'object')
            return false;
		return ( this.getFullYear() === compareDate.getFullYear() && 
            this.getMonth() === compareDate.getMonth() && 
            this.getDate() === compareDate.getDate() );
	};
	
	/**
	 * 比较日期大小,如果compareDate较大则返回true
	 * @param {Date} compareDate 要比较的日期
	 * @returns {boolean} 
	 */
	Date.prototype.isBefore= function( compareDate ) {
		var sDate = this;
		var eDate = compareDate;
		var flag = true;
		if (flag && sDate.getFullYear() > eDate.getFullYear()) {
			flag = false;
		}
		if (flag && sDate.getFullYear() == eDate.getFullYear()
				&& sDate.getMonth() > eDate.getMonth()) {
			flag = false;
		}
		if (flag && sDate.getFullYear() == eDate.getFullYear()
				&& sDate.getMonth() == eDate.getMonth()
				&& sDate.getDate() > eDate.getDate()) {
			flag = false;
		}
		return flag;
	};
	/**
	 * 取得当前日期的下一天
	 * @returns {Date} 
	 */
	Date.prototype.nextDay = function( ) {
		return new Date(Date.parse(this)+86400000);
	};

    Date.prototype.minus = function(date) {
        var interval = this.getTime() - date.getTime();
        return interval / 86400000;
    };
	
	
	
	$.lily.format = $.lily.format || {};
	
	$.extend( $.lily.format, {
		
		/*
		* 常量
		*/
		AREA_CODE : {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},
		MONEY_NUMS : new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"), 
		MONEY_DIGITS : new Array("", "拾", "佰", "仟"), 
		MONEY_BIGUNITS : new Array("", "万", "亿", "万亿","仟兆"),
		MONEY_SHOWNAME : new Array("分", "角", "圆"),
		
		MONEY_POSTFIX : "整",
		DATETIME_FORMAT : "yyyymmddhhmiss",
		TIME_FORMAT : "hhmiss",
		TIME_FORMAT_DISPLAY : "hh:mi:ss",
		DATE_FORMAT : "yyyy-mm-dd",
		DATE_FORMAT_DISPLAY : "yyyy年mm月dd日",
		DATE_FORMAT_SHORT : "yyyy-mm-dd",
		
		/**
		* 正则表达式定义
		*/
		REGEXP_INTEGER : new RegExp(/^[0-9]+$/),
		REGEXP_FLOAT : new RegExp(/^([0-9]+(\.+))[0-9]+$/),
		REGEXP_DECIMAL : new RegExp(/^([0-9]+(\.?))?[0-9]+$/),
		REGEXP_MONEY : new RegExp(/^[0-9]*\.?[0-9]{0,2}$/),
		REGEXP_COMMA : new RegExp('\,',["g"]),
		REGEXP_NEGSIGN : new RegExp('\-',["g"]),
		REGEXP_DOT : new RegExp('\\.',["g"]),
		REGEXP_EMAIL : new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/),
		REGEXP_DATE : new RegExp(/(yyyy|mm|dd|hh|mi|ss|ms)/gi),
		REGEXP_PHONE : new RegExp(/^((0\d{2,3})-)(\d{7,8})(-(\d{1,6}))?$/),
		REGEXP_MOBILE : new RegExp(/^(1[3|4|5|8])[0-9]{9}$/),
		REGEXP_FAX : new RegExp(/^((\d{3,4})[ \-])(\d{7,8})([ \*\-](\d{1,6}))?$/),
		// 验证身份证上的出生时间
		REGEXP_DATEFORMAT : new RegExp(/^[1|2]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3([0|1])))$/),
		REGEXP_POSITIVENUMBER : new RegExp(/^[1-9][0-9]*$/),		
		REGEXP_ODDNUMBER : new RegExp(/^[A-Za-z0-9]*$/),
		isEmpty: function(s) {
			return ( s == null || s.length == 0 );
		},

		isInteger: function(s) {
			return ( $.lily.format.REGEXP_INTEGER.test(s) );
		},
		
		/**
		* 判断输入变量是否是大于0的整数
		* @param {string} s 要检查的变量值
		* @returns {boolean} 是否为大于0的整数
		*/
		isPositiveNumber: function(s) {
			return ( $.lily.format.REGEXP_POSITIVENUMBER.test(s) );
		},

        isSameStart: function(one, another, index) {
            if(one.length < index || another < index)
                return false
            return one.substring(0,index) == another.sbustring(0, index)
        },
		
		/**
		* 判断输入变量是否是英文字母、数字、或者英文字母和数字的组合
		* @param {string} s 要检查的变量值
		* @returns {boolean} 是否是英文字母、数字、或者英文字母和数字的组合
		*/
		isOddNumber: function(s) {
			return ( $.lily.format.REGEXP_ODDNUMBER.test(s) );
		},
		
		/**
		* 判断输入变量是否是浮点数（即小数点后有数字）
		* @param {string} s 要检查的变量值
		* @returns {boolean} 是否为浮点数
		*/
		isFloat: function( s ){
		    return ( $.lily.format.REGEXP_FLOAT.test(s) );
		},

		/**
		* 检查字符串是否为正数（整数或浮点数)
		* @param {string} s 字符串
		* @returns {boolean} 是否为正数（整数或浮点数)
		*/
		isDecimal: function(s) {
		    return ( $.lily.format.REGEXP_DECIMAL.test(s) );
		},

		/**
		* 检查字符串是否为合法的金额
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法金额
		*/
		isMoney: function(s) {
		    return ( $.lily.format.REGEXP_MONEY.test(s) );
		},

		/**
		* 检查字符串是否为合法的固定电话号码
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法固定电话号码
		*/
		isPhone: function(s) {
			return ( $.lily.format.REGEXP_PHONE.test(s) );
		},

		/**
		* 检查字符串是否为合法的传真
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法传真
		*/
		isFax: function(s) {
			return ( $.lily.format.REGEXP_FAX.test(s) );
		},
		
		/**
		* 检查字符串是否为合法的手机号码
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法手机号码
		*/
		isMobile: function(s) {
		    return ( $.lily.format.REGEXP_MOBILE.test(s) );
		},

		/**
		* 检查字符串是否全部为中文
		* @param {string} s 字符串
		* @returns {boolean} 是否全部为中文
		*/
		isChinese: function(s) {
		    for (var index = 0, len = s.length; index < len; index++) {
		        var charCode = s.charCodeAt(index);
		        if ( ( charCode < 19968 ) || (charCode > 40869) ) {
		            return false;
		        }
		    }
		    return true;
		},

		/**
		* 检查字符串是否为合法的Email
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法Email
		*/
		isEmail: function(s) {
		    if(s.length>50){
		        return false;
		    }
		    return ( $.lily.format.REGEXP_EMAIL.test(s) );
		},
		
		/**
		 * 检查日期格式是否正确
		 */
		isDate:function(date,format){
			return ($.lily.format.REGEXP_DATEFORMAT.test(date));
		},
		
		/**
		* 检查字符串是否为合法的身份证号码
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法身份证号码
		*/
		isIDNumber: function( s ){
		    // 检查长度是否合法
		    switch(s.length){
		        case 15: case 18:{ 
		            break;
		        }
		        default:{
		            return false;
		        }
		    }
		    // 检查是否为数字
		    var testInt = ( s.length==15 ) ? s : s.substr(0,17) ;
		    if( !$.lily.format.isInteger(testInt) ) {
		        return false;
		    }
		    // 检查区域代码是否合法
		    var areaCode = parseInt( s.substr(0,2) );
		    if( !$.lily.format.AREA_CODE[areaCode] ) {
		        return false;
		    }
		    ///^([1-2]\d{3})(0?[1-9]|10|11|12)([1-2]?[0-9]|0[1-9]|30|31)$/ig
		    // 检查出生日期是否合法
		    var birthDay = ( s.length==15 ) ? ("19" + s.substr(6,6) ): s.substr(6,8);
		    if ( !$.lily.format.isDate( birthDay, $.lily.format.DATE_FORMAT ) ){
		        return false;
		    }
		    // 检查校验位是否合法
		    if ( s.length==18 ){
		    	var testNumber = ( parseInt(s.charAt(0)) + parseInt(s.charAt(10)) ) * 7
		            + ( parseInt(s.charAt(1)) + parseInt(s.charAt(11)) ) * 9
		            + ( parseInt(s.charAt(2)) + parseInt(s.charAt(12)) ) * 10
		            + ( parseInt(s.charAt(3)) + parseInt(s.charAt(13)) ) * 5
		            + ( parseInt(s.charAt(4)) + parseInt(s.charAt(14)) ) * 8
		            + ( parseInt(s.charAt(5)) + parseInt(s.charAt(15)) ) * 4
		            + ( parseInt(s.charAt(6)) + parseInt(s.charAt(16)) ) * 2
		            + parseInt(s.charAt(7)) * 1
		            + parseInt(s.charAt(8)) * 6
		            + parseInt(s.charAt(9)) * 3 ;
		        if ( s.charAt(17) != "10X98765432".charAt( testNumber % 11 ) ){
		            return false;
		        }
		    }
		    return true;
		},
		
		
		
		parseDate: function( dateString, format ){
			var year=2000,month=0,day=1,hour=0,minute=0,second=0;
			format = format ||  $.lily.format.DATE_FORMAT;
			var matchArray = format.match( $.lily.format.REGEXP_DATE );
			for (var i = 0; i < matchArray.length; i++ ) {
				var postion =format.indexOf( matchArray[i] );
				switch (matchArray[i]) {
					case "yyyy":{
						year = parseInt( dateString.substr(postion,4), 10 );
						break;
					}
					case "mm":{
						month = parseInt( dateString.substr(postion,2), 10 )-1;
						break;
					}
					case "dd":{
						day = parseInt( dateString.substr(postion,2), 10 );
						break;
					}
					case "hh":{
						hour = parseInt( dateString.substr(postion,2), 10 );
						break;
					}
					case "mi":{
						minute = parseInt( dateString.substr(postion,2), 10 );
						break;
					}
					case "ss":{
						second = parseInt( dateString.substr(postion,2), 10 );
						break;
					}
				}
			}
			return new Date(year,month,day,hour,minute,second);
		},
		
		formatDate: function(date, outFormat ) {
			if(date == '' || date == null){
				return '';
			}
			else {
				var parsedDate = date
				if(typeof date === "string") 
					parsedDate = $.lily.format.parseDate( date, $.lily.format.DATE_FORMAT )
				if(typeof date === 'number')
					parsedDate = new Date(date)
					
				
				if( outFormat && typeof outFormat === "string" ) {
					return parsedDate.format( outFormat );
				}
				else {
					return parsedDate.format( $.lily.format.DATE_FORMAT_SHORT );	
				}
			}
		},
		
		formatTime: function( data, format ){
			var parsedDate = $.lily.format.parseDate( data, $.lily.format.TIME_FORMAT );
			if( format && typeof outFormat === "string" ) {
				return parsedDate.format( format );
			}
			else {
				return parsedDate.format( $.lily.format.TIME_FORMAT_DISPLAY );	
			}
		},
        
        formatInputTime: function(e) {
            var pattern = /^\s*(\d{1,2})(?:[.:]?([0-5]\d?)?)?(?:[.:]?([0-5]\d?)?)?(?:\s*([ap])(?:\.?m\.?)?|\s*[h]?)?\s*$/i 
            var t, n, r, i, s, o, u, a, f;
            a = "" + e;
            if (e instanceof Date) 
                r = e.getHours(), s = e.getMinutes(), u = e.getSeconds()
            else if (i = a.match(pattern)) 
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
                r === 12 && t && (r = 0) 
            var hour = r != null ? r : 0
            var minute = s != null ? s : 0
            var second = u != null ? u : 0
            if (!(0 <= (r = hour) && 
                r <= 23 && 
                0 <= (i = minute) && 
                i <= 59 && 0 <= (s = second) && 
                s <= 59)) 
                throw Error("invalid time (" + hour + ", " + minute + ", " + second + ")");
            ampm = hour < 12 ? "am" : "pm", 
            hour === 0 ? hour12 = 12 : hour > 12 ? hour12 = hour - 12 : hour12 = hour
            function normalizeFormat(e) {
                return e < 10 ? "0" + e : "" + e
            }
            n = [normalizeFormat(minute), 
                    normalizeFormat(second)], 
            second === 0 && (n.pop(), minute === 0 && n.pop()) 
            n.length && (n = ":" + n.join(":")) 
            return "" + hour12 + n + ampm
        },

		formatDateTime: function( data, format ){
			var parsedDate = $.lily.format.parseDate( data, $.lily.format.DATETIME_FORMAT );
			if( format && typeof outFormat === "string" ){
				return parsedDate.format( format );
			}
			else {
				return parsedDate.format( $.lily.format.DATE_FORMAT_SHORT +" "+ $.lily.format.TIME_FORMAT_DISPLAY );	
			}
		},
		
		removeComma: function(str){
			return str.replace($.lily.format.REGEXP_COMMA,'');
		},
		removeNegSign: function(str){
			return str.replace($.lily.format.REGEXP_NEGSIGN,'');
		},
		
		addComma: function(str) {
			if (str.length > 3) {
				var mod = str.length % 3;
				var output = (mod > 0 ? (str.substring(0,mod)) : '');
				for (var i=0 ; i < Math.floor(str.length / 3); i++) {
					if ((mod == 0) && (i == 0))
						output += str.substring(mod+ 3 * i, mod + 3 * i + 3);
					else
						output += ',' + str.substring(mod + 3 * i, mod + 3 * i + 3);
				}
				return (output);
			}
			else 
				return str;
		},

		prepareCashString: function( cash, dot, digits ) {
			if (cash == undefined) cash = '0';
			if (dot == undefined) dot = true;
			if (digits == undefined) digits = 2;
			
			if (typeof cash !== 'string') {
				cash = cash.toString();
			}
			cash = $.lily.format.removeComma(cash);
			
			//TODO检查是否金额
			// 处理包含正负符号的情况
			var prefix = cash.charAt(0);
			if ( prefix == "-" || prefix == "+" ){
				return prefix + $.lily.format.prepareCashString( cash.substr(1), dot, digits );
			}
			
			if (cash.indexOf('.') != -1) {
				dot = true;	//如果输入串本身包含小数点，则忽略dot参数的设置，认为是真实金额大小
			}
			var integerCash, decimalCash;
			if (!dot) {
				if (cash.length <= digits) {
					cash = cash.leftPadZero(digits+1);
				}
				integerCash = cash.substring(0, cash.length - digits);
				decimalCash = cash.substring(cash.length - digits);
			} 
			else {
				var dotPos = cash.indexOf('.');
				if (dotPos != -1) {
					integerCash = cash.substring(0, dotPos);
					decimalCash = cash.substring(dotPos + 1);
				} 
				else {
					integerCash = cash;
					decimalCash = '';
				}
				if (integerCash.length == 0)
					integerCash = '0';
				if (decimalCash.length < digits) {
					decimalCash += '0'.times(digits - decimalCash.length);
				} 
				else {
					decimalCash = decimalCash.substring(0, digits);		//TODO 考虑四舍五入
				}
			}
			
			//去掉头部多余的0
			while (integerCash.charAt(0) == '0' && integerCash.length>1) {
				integerCash = integerCash.substring(1);
			}
			cash = integerCash + '.' + decimalCash;
			
			return cash;
		},
		
		convertIntegerToChineseCash: function(cash){
			if ( cash == "0" ) 
				return "";
		    var S = ""; //返回值 
		    var p = 0; //字符位置index 
		    var m = cash.length % 4; //取模 
		
		    // 四位一组得到组数 
		    var k = (m > 0 ? Math.floor(cash.length / 4) + 1 : Math.floor(cash.length / 4)); 
		    // 外层循环在所有组中循环 
		    // 从左到右 高位到低位 四位一组 逐组处理 
		    // 每组最后加上一个单位: "[万亿]","[亿]","[万]" 
		    for (var i = k; i > 0; i--)  {
		        var L = 4; 
		        if (i == k && m != 0) {
		            L = m;
		        }
		        // 得到一组四位数 最高位组有可能不足四位 
		        var s = cash.substring(p, p + L);
		        var l = s.length;
		
		        // 内层循环在该组中的每一位数上循环 从左到右 高位到低位 
		        for (var j = 0;j < l;j++) {
		            var n = parseInt(s.substring(j, j+1));
		            if (n == 0) {
		                if ((j < l - 1) && (parseInt(s.substring(j + 1, j + 1+ 1)) > 0) //后一位(右低) 
		                    && S.substring(S.length-1,S.length) != $.lily.format.MONEY_NUMS[n]) {
		                    S += $.lily.format.MONEY_NUMS[n];
		                }
		            }
		            else {
		                //处理 1013 一千零"十三",  1113一千一百"一十三" 
		//                if (!(n == 1 && (S.substring(S.length-1,S.length) == $.lily.format.MONEY_NUMS[0] | S.length == 0) && j == l - 2)) 
		//                {
		                    S += $.lily.format.MONEY_NUMS[n];
		//                }
		                S +=  $.lily.format.MONEY_DIGITS[l - j - 1];
		            }
		        }
		        p += L;
		        // 每组最后加上一个单位: [万],[亿] 等 
				if (i < k) {
					//不是最高位的一组 
					if (s>0) {
		                //如果所有 4 位不全是 0 则加上单位 [万],[亿] 等 
		                S += $.lily.format.MONEY_BIGUNITS[i - 1];
		            }
		        }
		        else {
		            //处理最高位的一组,最后必须加上单位 
		            S += $.lily.format.MONEY_BIGUNITS[i - 1];
		        }
		    }
			return S + $.lily.format.MONEY_SHOWNAME[2];
		},
		
		convertDecimalToChineseCash: function( cash ){
			var returnCash = "";
			if ( cash == "00" ){
				returnCash = $.lily.format.MONEY_POSTFIX;
			}
			else {
				for( var i = 0;i < cash.length; i++ ){
					if( i >= 2 ){break;}
					var intValue = parseInt(cash.charAt(i));
					switch( i ) {
						case 0:
							if ( intValue != 0 ){
								returnCash += $.lily.format.MONEY_NUMS[intValue] + $.lily.format.MONEY_SHOWNAME[1];
							}
							break;
						case 1:
							returnCash += $.lily.format.MONEY_NUMS[intValue] + $.lily.format.MONEY_SHOWNAME[0];
							break;
						default:
							break;
					}
				}
			}
			return returnCash;	
		},
		
		toPercentRate: function (rate){
			if($.lily.format.isEmpty(rate) ){
				return '';
			}
			if ( parseFloat(rate) == 0 ) {
				return '';
			}
			var temp = parseFloat(rate);
			return temp*100+"%";
		},
		
		toChineseCash: function( cash ){
			cash=$.lily.format.removeComma(cash);
			if ( $.lily.format.isEmpty(cash)|| !$.lily.format.isMoney(cash) ) {
				return '';
			}
			var noCommaCash = $.lily.format.prepareCashString(cash);
			if ( parseFloat(cash) == 0 ) {
				return '';
			}
			if( $.lily.format.isInteger( noCommaCash ) ) {
				return $.lily.format.convertIntegerToChineseCash(noCommaCash);
			}	
			var dotIndex = noCommaCash.indexOf('.');
			var integerCash = noCommaCash.substring( 0, dotIndex );
			var decimalCash = noCommaCash.substring( dotIndex + 1 );
			var result = "";
			if (!$.lily.format.isEmpty(integerCash) ){
				result += $.lily.format.convertIntegerToChineseCash(integerCash);
			}
			if ( !$.lily.format.isEmpty(decimalCash) ){
				result += $.lily.format.convertDecimalToChineseCash(decimalCash);
			}
			return result;
		},
		
		toCashWithComma: function( cash, dot, digits ) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if(cash == '' || cash == null){
				return '';
			}
			else {
				var temp = $.lily.format.prepareCashString( cash, dot, digits );
				
				var dotPos = temp.indexOf('.');
				var integerCash = temp.substring(0, dotPos);
				var decimalCash = temp.substring(dotPos + 1);
			
				// 处理包含正负符号的情况
				var prefix = integerCash.charAt(0);
				if ( prefix == "-" || prefix == "+" ) {
					temp = prefix + $.lily.format.addComma(integerCash.substring(1)) + '.' + decimalCash;
				} 
				else {
					temp = $.lily.format.addComma(integerCash) + '.' + decimalCash;
				}
				if(temp=="0.00"){
					return '';
				}
				return temp;
			}
		},
		
		/**
		 * 日期校验函数
		 * 
		 * **/
		checkDate:function(startDate,endDate,dur,minDate,maxDate){
			if($.lily.format.isEmpty(startDate)&&$.lily.format.isEmpty(endDate))
				return true;
			
			var sDate;
			var eDate;
			
			//如果只传入开始日期则默认判断结束日期是否在minDate之前，minDate为空则默认为一年前的当天。
			if(!$.lily.format.isEmpty(startDate)){
				if(startDate.length == 8){
					sDate = new Date(startDate.substr(0,4)+'/'+startDate.substr(4,2)+'/'+startDate.substr(6,2));
				}else{
					sDate = new Date(startDate.replace(/-/g,   "/"));
				}
				if($.lily.format.isEmpty(minDate)) {
					if(sDate.isBefore(new Date($.lily.format.getLastMonth($.lily.sessionData.session_sysDate,'12').replace(/-/g,   "/")))) 
						return '开始日期必须在一年以内！';
				}else {
					if(sDate.isBefore(new Date(minDate.replace(/-/g,   "/"))))
						return ('开始日期不能早于'+minDate+'！');
				}	
			}
			
			//如果只传入结束日期则默认判断结束日期是否在maxDate之前，maxDate为空则默认为当天。
			if(!$.lily.format.isEmpty(endDate)){
				if(endDate.length == 8){
					eDate = new Date(endDate.substr(0,4)+'/'+endDate.substr(4,2)+'/'+endDate.substr(6,2));
				}else{
					eDate = new Date(endDate.replace(/-/g,   "/"));
				}
				if($.lily.format.isEmpty(maxDate)) {
					if (!eDate.isBefore(new Date($.lily.sessionData.session_sysDate.replace(/-/g,   "/"))))
						return '结束日期不能超过今天！';
				}else {
					if (!eDate.isBefore(new Date(maxDate.replace(/-/g,   "/"))))
						return ('结束日期不能超过'+maxDate+'！');
				}
			}
			
			if(!sDate.isBefore(eDate)){
				return '开始日期不能大于结束日期！';
			};
			var durMonth ;
			if($.lily.format.isEmpty(dur)){
				durMonth = 3;
			}else{
				durMonth = parseInt(dur);
			}
			if(sDate.isBefore(new Date($.lily.format.getLastMonth( endDate,durMonth).replace(/-/g,   "/")))){
				return ('开始日期和结束日期之间的间隔不能超过'+durMonth+'月');
			}
			return true;
		},
		

		 /**
		 * 以天为单位获取日期
		 * @param {string} startDate指定日期，days间隔天数。
		 * @returns {string} 
		 * **/
		getLastDay:function(startDate,days){
			if(!($.lily.format.isEmpty(startDate))){
				return $.lily.format.formatDateToString((new Date(startDate.replace(/-/g,   "/"))).prevDay(days));
			}else{
				return $.lily.format.formatDateToString((new Date($.lily.sessionData.session_date.replace(/-/g,   "/"))).prevDay(days));
			}
		},
		/**
		 * 以月为单位获取日期,
		 * @param {string} startDate指定日期，decMonth间隔月份。
		 * @returns {string} 
		 * **/
		getLastMonth:function(startDate,decMonth){
			var $startDate = startDate;
			if($.lily.format.isEmpty($startDate)){
				$startDate = new Date($.lily.sessionData.session_date.replace(/-/g,   "/"));
			}else {
				if(startDate.length == 8){
					$startDate = new Date(startDate.substr(0,4)+'/'+startDate.substr(4,2)+'/'+startDate.substr(6,2));
				}else{
					$startDate = new Date(startDate.replace(/-/g,   "/"));
				}
			}
			var decMon =parseInt(decMonth) ;
			var month = $startDate.getMonth()+1;
			var day = $startDate.getDate();
			var year = $startDate.getFullYear();
			var monthHasDay = new Array([0],[31],[28],[31],[30],[31],[30],[31],[31],[30],[31],[30],[31]);
			while(decMon >=12){
				decMon -=12;
				year -=1;
			}
			if(month<=decMon){
				year -=1;
				month = 12-(decMon-month);
			}else{
				month -=decMon;
			}
			if((year%4==0 && year%100!=0)||(year%100==0 && year%400==0)){  
				monthHasDay[2] = 29;  
		     }
			day = monthHasDay[month] >= day ? day : monthHasDay[month];
			var stringDate = year+'-'+(month<10 ? "0" + month : month)+'-'+(day<10 ? "0"+ day : day);
			return stringDate;
		}
	});
})(jQuery)
