/**
 * jQuery validator - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 *
 */
  
(function( $, undefined ){
	
	$.lily.validator = $.lily.validator || {};
	
	$.extend( $.lily.validator, {
		/*
		 * 常量
		 */
		ACCOUNTNO_MIN : 15,			//账号最小长度
		ACCOUNTNO_MAX : 21, 		//账号最大长度
		CURRENCY_MAX : 18,			//金额最大长度
		CURRENCY_NO_DOT : false,	//后台存储的金额是否没有小数点
		

		failStop : false,			// 是否在第一次校验失败后就停止校验
		countByChar : true,
		tipContainer : null		//tipContainer
	});
	
	$.extend( $.lily.validator, {
		/*
		 * 多语言资源模板定义：其中{%name}表示被校验项的名称
		 */
		LANGUAGE_ACCOUNT : "{%name}为" + $.lily.validator.ACCOUNTNO_MIN + "位至" + $.lily.validator.ACCOUNTNO_MAX + "位的数字",
		LANGUAGE_SELECT : "请选择{%name}",
		LANGUAGE_REQUEST_INPUT : "请输入{%name}，此为必输项",
		LANGUAGE_DATA_ILLEGAL : "请输入合法的{%name}",
		LANGUAGE_SHORTER_THAN_MIN_LENGTH : "{%name}长度不能小于{%minLength}个字符",
		LANGUAGE_LONGER_THAN_MAX_LENGTH : "{%name}长度不能大于{%maxLength}个字符",
		LANGUAGE_LENGTH_NOT_EQUAL : "{%name}长度必须为{%length}",
		LANGUAGE_LESS_THAN_MIN_VALUE : "{%name}不能小于{%minValue}",
		LANGUAGE_GREATER_THAN_MAX_VALUE : "{%name}不能大于{%maxValue}",
		LANGUAGE_DATATYPE_NOT_INTEGER : "{%name}请输入数字",
		LANGUAGE_DATATYPE_NOT_DECIMAL : "{%name}请输入合法的浮点数",
		LANGUAGE_DATATYPE_NOT_CHINESE : "{%name}请输入中文",
		LANGUAGE_NOT_EQUAL : "两次输入的{%name}不相同",
		LANGUAGE_EQUAL : "两次输入的{%name}相同",
		LANGUAGE_GROUP_NOT_SAME : "需要全部输入或者全部留空",
		LANGUAGE_GROUP_NOT_ONE : "只需要输入其中一项",
		LANGUAGE_GROUP_NOT_SINGLE : "必须并且只需输入其中一项",
		LANGUAGE_GROUP_NO_INPUT : "需要至少输入其中一项",
		LANGUAGE_PHONE_ILLEGAL : "请输入合法的{%name}，格式为区号-电话号-分机号",
		LANGUAGE_CONFIRMPWD_NO_EQUALS : "确认密码必须和您的新密码相等",
		LANGUAGE_POSITIVENUMBER_ILLEGAL : "请输入合法的{%name}，格式为大于1的整数",
		LANGUAGE_STARTDATE_ILLEGAL : "{%name}不能晚于当前日期",
		LANGUAGE_ENDDATE_ILLEGAL : "日期范围不能超过3个月",
		LANGUAGE_LESS_THAN_START:"开始日期不能晚于结束日期"
	});
	
	$.extend( $.lily.validator, {
		/**
	     * 内置的数据类型定义
	     *       select  : 选择框
	     *       combox  : Liana.Combox组件
	     *       radio   : 单选按钮
	     *       checkbox : 选择框
	     *       file        : 文件选择
	     *       number  : 非负整数
	     *       decimal : 浮点数
	     *       currency    : 金额
	     *       chinese : 中文
	     *       email   : 电子邮件
	     *       date        : 日期
	     *       time        : HHMMSS 格式的时间
	     *       phone   : 固定电话（国内）
	     *       mobile  : 手机号（国内）
	     *       IDNumber: 身份证号码（国内）
	     * @private
	     * @type object 格式说明
	     *   currency:{
	     *       errorTemplet: // 错误信息模板
	     *       valueTester : ( function( value ){
	     *           // 测试函数，需返回true或false
	     *       }),
	     *       fieldTester : ( function( config ){
	     *           // 测试函数，需返回true或false
	     *       }),
	     *       afterPass : ( function( value, fieldConfig ){
	     *           // 测试返回true后的回调函数
	     *       }),
	     *       afterFail : ( function( value, fieldConfig ){
	     *           // 测试返回false后的回调函数
	     *       }),
	     *       output : ( function( fieldConfig ){
	     *           // 返回格式化后的数据
	     *       }),
	     *   },
	     */
	    _typeDefine:{
	        'accountNo':{
	            errorTemplet: $.lily.validator.LANGUAGE_ACCOUNT,
	            valueTester : ( function( value ) {
	                return ( $.lily.format.isInteger(value) &&  value.length >= $.lily.validator.ACCOUNTNO_MIN && value.length <= $.lily.validator.ACCOUNTNO_MAX);
	            }),
	            resetter: ( function( fieldConfig ) {
	            	if(fieldConfig.$element.data("accountSelect"))
	            		fieldConfig.$element.data("accountSelect").reset();
	            })
	        },
	        'chinese':{
	            errorTemplet: $.lily.validator.LANGUAGE_DATATYPE_NOT_CHINESE,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isChinese(value) );
	            } )
	        },
	        'checkbox':{
	            output : ( function( fieldConfig ){
	                return $('#' + fieldConfig.id).checked;
	            } )
	        },
	        'combox':{
	            errorTemplet: $.lily.validator.LANGUAGE_SELECT,
	            fieldTester : ( function( fieldConfig ){
	                var combox = $('#' + fieldConfig.id).combox;
	                return ( combox.getValue() != null );
	            } ),
	            output : ( function( fieldConfig ){
	                var combox = $('#' + fieldConfig.id).combox;
	                return combox.getValue();
	            } )
	        },
	        'currency':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATA_ILLEGAL,
	            valueTester : ( function( value ){
	                var valueWithoutDot = $.lily.format.removeComma(value);
	                if ( valueWithoutDot.length > $.lily.validator.CURRENCY_MAX ){
	                    return false;
	                }
	                return ( $.lily.format.isMoney( valueWithoutDot ) );
	            } ),
	            afterPass : ( function( value, fieldConfig, currentElement){
	            	if ( fieldConfig.chineseDisplay ) {
	                    $('#' + fieldConfig.chineseDisplay, currentElement).text( $.lily.format.toChineseCash(value) );
	                }
	                var formatCurrency = $.lily.format.toCashWithComma( value );
	                fieldConfig.$element.val(formatCurrency);
	            } ),
	            afterFail : ( function( value, fieldConfig,currentElement ){
	                if ( fieldConfig.chineseDisplay ) {
	                    $( fieldConfig.chineseDisplay, currentElement).val( "" );
	                }
	            } ),
	            output : ( function( fieldConfig ) {
	                var out = $.lily.format.removeComma( fieldConfig.$element.val() );
	                if ( $.lily.validator.CURRENCY_NO_DOT ){
	                    out = $.lily.format.removeDot( out );
	                }
	                return out;
	            } ),
	            resetter: ( function( fieldConfig, currentElement) {
	            	$('#' + fieldConfig.chineseDisplay, currentElement).text("");
	            })
	        },
	        'date':{
	            valueTester : ( function(){
	                // 数据格式的校验由Liana.Calendar完成，此处不校验
	                return true;
	            } ),
	            output : ( function( fieldConfig ) {
	            	var fieldValue = fieldConfig.$element.val();
	                return fieldValue + " 00:00:00";
	            })
	        },
	        'decimal':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATATYPE_NOT_DECIMAL,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isDecimal(value) );
	            } )
	        },
	        'email':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATA_ILLEGAL,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isEmail(value) );
	            } )
	        },
	        'file':{
	            valueTester : ( function(){
	                // 文件类型校验使用自定义的正则表达式，此处不校验
	                return true;
	            } )
	        },
	        'IDNumber':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATA_ILLEGAL,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isIDNumber(value) );
	            } )
	        },
	        'number':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATATYPE_NOT_INTEGER,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isInteger(value) );
	            } )
	        },
	        'positiveNumber':{
	            errorTemplet:$.lily.validator.LANGUAGE_POSITIVENUMBER_ILLEGAL,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isPositiveNumber(value) );
	            } )
	        },
	        'oddNumber':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATA_ILLEGAL,
	            valueTester : ( function( value ){
	            	if($.lily.format.isEmpty(value)){
	            		return true;
	            	}
	                return ( $.lily.format.isOddNumber(value) );
	            } )
	        },
	        'radio':{
	            output : ( function( fieldConfig ){
	                var radioList = $("input:checked", fieldConfig.$element);
	                if ( radioList.length === 0 ){
	                    return null;
	                }
	                return radioList[0].value;
	            } )
	        },
	        'select':{
	            errorTemplet:$.lily.validator.LANGUAGE_SELECT,
	            valueTester : ( function( value ){
	                return ( !$.lily.format.isEmpty(value) );
	            } )
	        },
	        'time':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATA_ILLEGAL,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isTime(value) );
	            } )
	        },
	        'phone':{
	            errorTemplet:$.lily.validator.LANGUAGE_PHONE_ILLEGAL,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isPhone(value) );
	            } )
	        },    
	        'fax':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATA_ILLEGAL,
	            valueTester : ( function( value ){
	                return ( $.lily.format.isFax(value) );
	            } )
	        },
	        'mobile':{
	            errorTemplet:$.lily.validator.LANGUAGE_DATA_ILLEGAL,
	            valueTester : ( function( value ){
	                if ($.lily.format.isEmpty(value)){
	                    return false;
	                }
	                return ( $.lily.format.isMobile(value) );
	            } )
	        },
	        'newPWD':{
	        	errorTemplet:$.lily.validator.LANGUAGE_DATATYPE_NOT_INTEGER,
	            valueTester : ( function( value ){
	            	//新密码必须是数字
	                return ( $.lily.format.isInteger(value) );
	            } )
	        },
	        'confirmPWD':{
	        	errorTemplet:$.lily.validator.LANGUAGE_CONFIRMPWD_NO_EQUALS,
	        	fieldTester: function(fieldConfig) {
	        		//判断起止日期不能超过3个月
	        		if (fieldConfig.newPwd) {
	        			var newPwd = $("#"+fieldConfig.newPwd, fieldConfig.currentElement).val();
	        			var confirmPwd = $("#"+fieldConfig.id, fieldConfig.currentElement).val();
	        			if (!$.lily.format.isInteger(confirmPwd))
	        				return false;
	        			else if(newPwd!=confirmPwd)
	        				return false;
	        			else 
	        				return true;
	        		}
	        	}
	        },
	        'startDate':{
	        	errorTemplet:$.lily.validator.LANGUAGE_STARTDATE_ILLEGAL,
	        	valueTester: function(value) {
	        		//开始日期必须在一年以内
	        		return !$.perbank.isEmptyStr(value) && $.perbank.isInOneYear(value);
	        	}
	        },
	        'endDate':{
	        	errorTemplet:$.lily.validator.LANGUAGE_ENDDATE_ILLEGAL,
	        	fieldTester: function(fieldConfig) {
	        		//判断起止日期不能超过3个月
	        		if (fieldConfig.startDate) {
	        			var startDate = $("#"+fieldConfig.startDate, fieldConfig.currentElement).val();
	        			var endDate = $("#"+fieldConfig.id, fieldConfig.currentElement).val();
	        			if ($.perbank.isEmptyStr(startDate) || $.perbank.isEmptyStr(endDate))
	        				return false;
	        			else
	        				return $.perbank.isInThreeMonth(startDate, endDate);
	        		} else
	        			alert("要进行日期范围的校验，必须在结束日期配置中指定开始日期");
	        	}
	        }
	    },
		
		_dataAccesser : function(fieldConfig) {
			
			if (fieldConfig.isExtra) {
				return null;
			}
			if(fieldConfig.type) {
				var typeDefine = $.lily.validator._typeDefine[fieldConfig.type];
				if ( typeDefine && typeDefine.output) {
					return typeDefine.output(fieldConfig);
				}
			}
			
			if (fieldConfig.$element == null) {
				alert( "Validator: Field["+fieldConfig.id+"] not found in html!" );
				return null;
			}
			fieldValue = fieldConfig.$element.val();
			if(fieldConfig.formatType == "account") {
				fieldValue = fieldValue.substring(0,fieldValue.indexOf("["));
			}
			return fieldValue;
		},
		
		_errorHandler : function(errors) {
			
		},
		
		_requiredValidator : function(fieldValue, fieldConfig) {

			//radio一定检查是否选中
			if (fieldConfig.type == 'radio') {
				var radioList = $("input:checked", fieldConfig.$element);
				if ( radioList.length === 0 ){
					this._errorCount++;
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_SELECT, true );
				}
				return true;
			}
			// 必输项校验
			if (fieldValue.blank() || fieldValue==fieldConfig.defaultValue) {
				if (this._ignoreBlank) {
					return false;
				}
				if (fieldConfig.require) {
					this._errorCount++;
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_REQUEST_INPUT );
				} 
				else {
					return false;	//如果没有输入内容，则不再进行后续检验
				}
			}
			return true;
		},
		
		_lengthValidator : function(fieldValue, fieldConfig) {

			if ( fieldConfig.minLength!=null || fieldConfig.maxLength!=null || fieldConfig.length!=null){
				var inputLength = 0;
				if ( $.lily.validator.countByChar ){
					// 按字符计算长度
					inputLength = fieldValue.length;
				}
				else {
					// 按字节计算长度（编码为UTF-8时）
					for (var index = 0, len = fieldValue.length; index < len; index++) {
						var charCode = fieldValue.charCodeAt(index);
						if (charCode < 0x007f) {
							inputLength ++;
						} 
						else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
							inputLength += 2;
						} 
						else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
							inputLength += 3;
						}
				    }
				}
				if ( fieldConfig.length!=null && inputLength != fieldConfig.length ) {
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_LENGTH_NOT_EQUAL );
				}
				if ( fieldConfig.minLength!=null && inputLength < fieldConfig.minLength ) {
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_SHORTER_THAN_MIN_LENGTH );
				}
				if ( fieldConfig.maxLength!=null && inputLength > fieldConfig.maxLength ) {
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_LONGER_THAN_MAX_LENGTH );
				}
			}
			return true;
		},
		
		_valueRangeValidator : function(fieldValue, fieldConfig) {
			if (fieldConfig.startDate!=null ){
				// 字符串去掉,并转换为浮点数
				var endDateValue = Date.parse(fieldValue.replace("-","/"));
				var startDateValue = Date.parse($("#"+fieldConfig.startDate, fieldConfig.currentElement).val().replace("-","/"));
				if (endDateValue < startDateValue ){
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_LESS_THAN_START );
				}
			}
			if ( fieldConfig.minValue!=null || fieldConfig.maxValue!=null ){
				// 字符串去掉,并转换为浮点数
				var checkValue = parseFloat( fieldValue.replace( new RegExp('\,',["g"]),'') );
				if ( fieldConfig.minValue!=null && checkValue < fieldConfig.minValue ){
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_LESS_THAN_MIN_VALUE );
				}
				if ( fieldConfig.maxValue!=null && checkValue > fieldConfig.maxValue ){
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_GREATER_THAN_MAX_VALUE );
				}
			}
			return true;
		},

		_dataTypeValidator : function(fieldValue, fieldConfig, ruleHash, currentElement) {
			var result = true;
			if ( fieldConfig.type!=null ) {
				var typeDefine = $.lily.validator._typeDefine[fieldConfig.type];
				if ( typeDefine ){
					if ( typeDefine.valueTester ){
						result = typeDefine.valueTester(fieldValue);
					} 
					else if ( typeDefine.fieldTester ){
						result = typeDefine.fieldTester(fieldConfig);
					}
					if ( result && typeDefine.afterPass ) {
						typeDefine.afterPass(fieldValue, fieldConfig, currentElement);
					}
					if ( !result ){
						if ( typeDefine.afterFail ) {
							typeDefine.afterFail(fieldValue, fieldConfig, currentElement);
						}
						return $.lily.validator._getErrorMessage( fieldConfig, typeDefine.errorTemplet );
					}
				}
				else {
					alert( "$.lily.Validator: Datatype["+fieldConfig.type+"] not supported!" );	
				}	
			}
			return true;
		},
		
		_regexpValidator : function(fieldValue, fieldConfig) {

			if ( fieldConfig.regexp!=null ){
				var result = ( new RegExp( fieldConfig.regexp ) ).test(fieldValue);
				if ( !result ) {
					return $.lily.validator._getErrorMessage( fieldConfig, $.lily.validator.LANGUAGE_DATA_ILLEGAL );
				}
			}
			return true;
		},
		
		_equalToValidator : function(fieldValue, fieldConfig, ruleHash) {
			// 检查是否和指定域的值相等或不等
			if ( fieldConfig.equalTo || fieldConfig.notEqualTo ){
				var targetId = ( fieldConfig.equalTo ) ? fieldConfig.equalTo : fieldConfig.notEqualTo;
				var targetConfig = ruleHash[targetId];
				var targetValue;
				if ( targetConfig ){
					// 如果目标类型已定义，使用其输出格式化函数
					var typeDefine = $.lily.validator._typeDefine[targetConfig.type];
					if ( typeDefine && typeDefine.output ){
						targetValue = typeDefine.output(targetConfig);
					}
					else {
						targetValue = targetConfig.$element.val();
					}
				}else{
					targetValue = $(targetId);
				}
				if ( fieldConfig.equalTo && fieldValue != targetValue  ){
					return $.lily.validator._getErrorMessage( targetConfig, $.lily.validator.LANGUAGE_NOT_EQUAL );
				}
				if ( fieldConfig.notEqualTo && fieldValue == targetValue  ){
					return $.lily.validator._getErrorMessage( targetConfig, $.lily.validator.LANGUAGE_EQUAL );
				}
			}
			return true;
		},
		
		_checkerValidator : function(fieldValue, fieldConfig, ruleHash, currentElement) {
			// 自定义的校验函数
			if ( fieldConfig.checker != null ){
				var chekerResult = eval(fieldConfig.checker + "(fieldConfig, fieldValue, currentElement)");
				if ( chekerResult !== true ){
					var errorTemplet = ( chekerResult === false ) ? $.lily.validator.LANGUAGE_DATA_ILLEGAL : chekerResult;
					return $.lily.validator._getErrorMessage( fieldConfig, errorTemplet ); 
				}
			}
			return true;
		},
		
		_relatedValidator : function(fieldValue, fieldConfig) {
		
			if ($.isArray(fieldConfig.related) && this._relatedCheckDepth < 5) {
				this._relatedCheckDepth ++;
				try {
					this.checkFields(fieldConfig.related);
				} 
				catch (e) {
					return false;
				}
				this._relatedCheckDepth --;
			}
			return true;
		},
		
		_commonReset: function(fieldConfig, currentElement) {
			if ( fieldConfig.type!=null ) {
				var typeDefine = $.lily.validator._typeDefine[fieldConfig.type];
				if ( typeDefine ){
					if ( typeDefine.resetter ) {
						result = typeDefine.resetter(fieldConfig, currentElement);
					}
				}
			}
		},
		
		/**
		* 根据模板生成要显示的错误信息
		* @private
		* @param {object} config 校验配置
		* @param {string} templet 信息模板
		* @returns {string} 生成的错误信息
		*/
		_getErrorMessage : function( config, templet, ignoreCustom ){
			
			// 使用自定义的提示信息模板
			if (!ignoreCustom && config.templet != null) {
				templet = config.templet;
			}
			
			if ( window.Ln ){
				templet = Ln.g( templet, config );
			}
			var result = templet;
			var dataBeginPos = 0;
			while ( true ){
				// 模板中使用%作为变量前缀
				dataBeginPos = result.indexOf( "{%", dataBeginPos );
				if ( dataBeginPos < 0 ){
					break;
				}
				var dataEndPos = result.indexOf( "}", dataBeginPos );
				var dataName = result.substring( dataBeginPos+2, dataEndPos );
				result = result.substring( 0, dataBeginPos ) + config[dataName] + result.substring( dataEndPos+1 );
			}
			return result;
		}
	});

	"use strict"
	
	var Validator = function (element, options) {
		this.$element = $(element);
		this.options = options;
		this._rules = [];
		this.ruleHash = {};
		var self = this;
		$('input' , this.$element).each(function () {
			var $this = $(this);
			var dataValidate = $this.attr('data-validate');
			if(dataValidate) {
				var config = $.parseJSON(dataValidate);
                if(!config.name) {
                    config.name = $this.attr("placeholder");
                }
				config.$element = $this;
				self.addRule(config);
				if(!config.type || config.type !== 'accountNo') {
					$this.blur(function() {
						result = self.checkRule(config);
						if ( !result.passed ) {
							if(self.options.showErrorInWindow)
								self.addErrors(result);
							else
								self.showError($this, result.error)
						}
						else {
							self.hideError($this)
						}
					});
				}
			}
		});
	}
	
	Validator.prototype = {
		constructor: Validator,
		
		addRule: function(config) {
			config.id = config.$element.attr("name")
			if ( !config.id ){
				alert( "Validator: Field id must be set!" );
				return;
			}
			
			config.key = config.id;
			
			this._rules.push(config);
			this.ruleHash[config.key] = config;
		},
		
		check: function() {
			var errors = [];
			var requestData = {};
			var signData = [];
			for(var i = 0,size = this._rules.length;i < size; ++i) {
				var rule = this._rules[i];
				if(rule.$element.hasClass("disabled")) 
					continue;
				var result = this.checkRule(rule);
				if ( result.passed ) {
					requestData[rule.id] = result.data;
					this.hideError(rule.$element)
				}
				else {
					errors.push(result);
					if(!this.options.showErrorInWindow)
						this.showError(rule.$element, result.error)
				}
			}
			if (errors.length > 0 && this.options.showErrorInWindow) {
				this.addErrors(errors);
			}

			return {
				passed: errors.length == 0,
				requestData: requestData,
				signData: signData
			};
		},

		hideError: function(element) {
			element.parent().next(".op-error").remove();
		},

		showError: function(element, message) {
			this.hideError(element)
			element.parent().after('<span class="op-error">' + message + '</span>')
		},
		addErrors: function(errors) {
			var htmlStr = "<ul>";

			if($.isArray(errors)) {
				for(var i = 0, length = errors.length; i < length; ++i) {
					htmlStr += '<li>' + errors[i].error + '</li>';
				}
			}
			else {
				htmlStr += '<li>' + errors.error + '</li>';
			}
			htmlStr += "</ul>";
			var errorHtmlObj = $(htmlStr);
			$.openWindow({
				backdrop: false, 
				content: errorHtmlObj,
				allowMinimize: false,
				windowClass: 'error-show',
				showFun: null,
				closeFun: null,
				appendTo: 'body',
				autoClose: 2000
			});
		},
		
		checkRule: function(rule) {
			
			var key = rule.key;
			var dataAccesser = $.isFunction(rule.dataAccesser) ? rule.dataAccesser : this.options.dataAccesser;
			var batch = rule.batch;
			var validators = rule.validator;
			var ignoreCommonValidators = rule.ignoreCommonValidators;
			var enabled = rule.enabled;
			
			if (enabled == false) {
				return;
			}
			
			if (!$.isFunction(dataAccesser))
				return;
			
			var data = dataAccesser(rule);
			
			var commonValidators = this.options.commonValidators;
			if (commonValidators && !ignoreCommonValidators) {
				var commonSize = commonValidators.length;
				for (var i=0; i<commonSize; i++) {
					var commonValidator = commonValidators[i];
					
					if ($.isFunction(commonValidator)) {
						var result = commonValidator(data, rule);
						if (result === undefined || result == null || result == false) {
							return {
								passed: true,
								key : key,
								error : result,
								data : data,
								rule : rule
							};
						}
						if (result != true) {
							return {
								passed: false,
								key : key,
								error : result,
								data : data,
								rule : rule
							};
						}
					}
				}
			}
			
			if (!$.isArray(validators)) {
				validators = [validators];
			}
			var size = validators.length
			for (var i=0; i<size; i++) {
				var validator = validators[i];
				
				if ($.isFunction(validator)) {
					var result = validator(data, rule);
					if (result === undefined || result == null || result == false) {
						return {
							passed: true,
							key : key,
							error : result,
							data : data,
							rule : rule
						};
					}
					if (result != true) {
						return {
							passed: false,
							key : key,
							error : result,
							data : data,
							rule : rule
						};
					}
				}
			}
			return {
				passed: true,
				key : key,
				error : result,
				data : data,
				rule : rule
			};
		},
		
		reset: function() {
			for(var i = 0,size = this._rules.length;i < size; ++i) {
				var rule = this._rules[i];
				$.lily.validator._commonReset(rule, this.$element);
			}
		}
	}
	
	$.fn.validator = function ( option ) {
		return this.each(function () {
      		var $this = $(this), 
      			data = $this.data('validator'), 
      			options = $.extend({}, $.fn.validator.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) 
      			$this.data('validator', (data = new Validator(this, options)));
    	});
	}
	
	$.fn.validator.defaults = {
		showErrorInWindow: false,
		dataAccesser : $.lily.validator._dataAccesser ,
		errorHandler : $.lily.validator._errorHandler ,
		commonValidators : [
		    $.lily.validator._requiredValidator ,
		    $.lily.validator._lengthValidator ,
		    $.lily.validator._valueRangeValidator ,
		    $.lily.validator._dataTypeValidator ,
		    $.lily.validator._regexpValidator ,
		    $.lily.validator._equalToValidator ,
		    $.lily.validator._checkerValidator ,
		    $.lily.validator._relatedValidator
		]
	}
	
	$.fn.validator.Constructor = Validator;
	
})( window.jQuery );
	
	
