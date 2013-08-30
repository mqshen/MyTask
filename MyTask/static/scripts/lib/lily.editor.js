!function(){
    "use strict"

    var Editor = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.editor.defaults, options)
        this.init()
    }

    Editor.prototype = {
        constructor: Editor,

        init: function() {
			this.$box = $('<div class="editor_box"></div>')
            var self = this

            function initFrame() {
			}

		    this.window = window;	
            this.document = document;
			this.$editor = $('<div class="wysihtml5-sandbox" contenteditable="true" frameborder="0"></div>')
            this.$editor.width(this.$element.width())
            if (this.options.css) {
				this.$editor.contents().find('head').append('<link rel="stylesheet" href="' + this.options.css + '" />');
			}
            this.$editor.css({
                'margin': '5px 0px',
                'color': 'rgb(0, 0, 0)',
                'cursor': 'auto',
                'font-family': '"ProximaNova","Helvetica Neue",helvetica,arial,sans-serif',
                'font-size': '15px',
                'font-style': 'normal',
                'font-variant': 'normal',
                'font-weight': 'normal',
                'line-height': '25px',
                'letter-spacing': 'normal',
                'text-align': 'start',
                'text-decoration': 'none',
                'text-indent': '0px',
                'text-rendering': 'auto',
                'word-break': 'normal',
                'word-wrap': 'break-word',
                'word-spacing': '0px'
            })

            this.$editor.addClass("wysiwyg_editor");
			this.$editor.html(html);
			this.$element.hide();
            var html = '';
			// get html
			html = this.$element.val();
			html = this.savePreCode(html);

			this.$box.insertAfter(this.$element).append(this.$editor).append(this.$element);
			html = this.paragraphy(html);
			this.$editor.html(html);

            this.keyup()
            this.keydown()
            this.paste()
			this.buildToolbar();
            // buttons response
			if (this.options.activeButtons !== false && this.options.toolbar !== false) {
			    var observeFormatting = $.proxy(function() { this.observeFormatting(); }, this);
			    this.$editor.click(observeFormatting).keyup(observeFormatting);
            }
            if (this.options.fixed) {
				this.observeScroll();
				$(document).scroll($.proxy(this.observeScroll, this));
			}
        },
        
        buildFileContainer: function() {
        },
        
		buildToolbar: function() {
			if (this.options.toolbar === false) {
				return false;
			}

			this.$toolbar = $('<div>').addClass('editor_toolbar');

            this.$box.prepend(this.$toolbar);

			$.each(this.options.buttons, $.proxy(function(i,key) {

				if (key !== '|' && typeof this.options.toolbar[key] !== 'undefined') {
					var s = this.options.toolbar[key];

					if (this.options.fileUpload === false && key === 'file') {
						return true;
					}
					this.$toolbar.append(this.buildButton(key, s));
				}
			}, this));

		},
		buildButton: function(key, s) {
			var button = $('<a href="javascript:void(null);" title="' + s.title + '" class="editor_btn_' + key + '">' + s.title + '</a>');

			if (typeof s.func === 'undefined') {
				button.click($.proxy(function() {
					if ($.inArray(key, this.options.activeButtons) != -1) {
						this.inactiveAllButtons();
						this.setBtnActive(key);
					}

					if ($.lily.browser('mozilla')) {
						this.$editor.focus();
						//this.restoreSelection();
					}

					this.execCommand(s.exec, key);

				}, this));
			}
			else if (s.func !== 'show') {
				button.click($.proxy(function(e) {

					this[s.func](e);

				}, this));
			}

			if (typeof s.callback !== 'undefined' && s.callback !== false) {
				button.click($.proxy(function(e) { s.callback(this, e, key); }, this));
			}

			return button;
		},

        paste: function() {
            this.$editor.bind('paste', $.proxy(function(e) {
			    if (this.options.cleanup === false) {
			    	return true;
			    }

			    this.pasteRunning = true;

			    this.setBuffer();

			    if (this.options.autoresize === true) {
			    	this.saveScroll = this.document.body.scrollTop;
			    }
			    else {
			    	this.saveScroll = this.$editor.scrollTop();
			    }

			    var frag = this.extractContent();

			    setTimeout($.proxy(function() {
			    	var pastedFrag = this.extractContent();
			    	this.$editor.append(frag);

			    	this.restoreSelection();

			    	var html = this.getFragmentHtml(pastedFrag);
			    	this.pasteCleanUp(html);
			    	this.pasteRunning = false;

			    }, this), 1);
		    }, this));
        },
		keydown: function() {
			this.$editor.keydown($.proxy(function(e) {
				var key = e.keyCode || e.which;
				var parent = this.getParentNode();
				var current = this.getCurrentNode();
				var pre = false;
				var ctrl = e.ctrlKey || e.metaKey;

				if ((parent || current) && ($(parent).get(0).tagName === 'PRE' || $(current).get(0).tagName === 'PRE')) {
					pre = true;
				}

				// callback keydown
				if (typeof this.options.keydownCallback === 'function') {
					this.options.keydownCallback(this, e);
				}

				if (ctrl && this.options.shortcuts) {
					if (key === 90) {
						if (this.options.buffer !== false) {
							e.preventDefault();
							this.getBuffer();
						}
						else if (e.shiftKey) {
							this.shortcuts(e, 'redo');	// Ctrl + Shift + z
						}
						else {
							this.shortcuts(e, 'undo'); // Ctrl + z
						}
					}
					else if (key === 77) {
						this.shortcuts(e, 'removeFormat'); // Ctrl + m
					}
					else if (key === 66) {
						this.shortcuts(e, 'bold'); // Ctrl + b
					}
					else if (key === 73) {
						this.shortcuts(e, 'italic'); // Ctrl + i
					}
					else if (key === 74) {
						this.shortcuts(e, 'insertunorderedlist'); // Ctrl + j
					}
					else if (key === 75) {
						this.shortcuts(e, 'insertorderedlist'); // Ctrl + k
					}
					else if (key === 76) {
						this.shortcuts(e, 'superscript'); // Ctrl + l
					}
					else if (key === 72) {
						this.shortcuts(e, 'subscript'); // Ctrl + h
					}
				}

				// clear undo buffer
				if (!ctrl && key !== 90) {
					this.options.buffer = false;
				}

				// enter
				if (pre === true && key === 13) {
					e.preventDefault();

					var html = $(current).parent().text();
					this.insertNodeAtCaret(this.document.createTextNode('\r\n'));
					if (html.search(/\s$/) == -1) {
						this.insertNodeAtCaret(this.document.createTextNode('\r\n'));
					}
					this.syncCode();
					return false;
				}

				// tab
				if (this.options.shortcuts && !e.shiftKey && key === 9) {
					if (pre === false) {
						this.shortcuts(e, 'indent'); // Tab
					}
					else {
						e.preventDefault();
						this.insertNodeAtCaret(this.document.createTextNode('\t'));
						this.syncCode();
						return false;
					}
				}
				else if (this.options.shortcuts && e.shiftKey && key === 9 ) {
					this.shortcuts(e, 'outdent'); // Shift + tab
				}

				// safari shift key + enter
				if ($.lily.browser('webkit') && navigator.userAgent.indexOf('Chrome') === -1) {
					return this.safariShiftKeyEnter(e, key);
				}
			}, this));
		},
        // SAFARI SHIFT KEY + ENTER
		safariShiftKeyEnter: function(e, key) {
			if (e.shiftKey && key === 13) {
				e.preventDefault();
				this.insertNodeAtCaret($('<span><br /></span>').get(0));
				this.syncCode();
				return false;
			}
			else {
				return true;
			}
		},
        // FORMAT EMPTY
		formatEmpty: function(e) {
			var html = $.trim(this.$editor.html());
			if ($.lily.browser('mozilla')) {
				html = html.replace(/<br>/i, '');
			}

			var thtml = html.replace(/<(?:.|\n)*?>/gm, '');

			if (html === '' || thtml === '') {
				e.preventDefault();
				var node = $(this.options.emptyHtml).get(0);
				this.$editor.html(node);
				this.setSelection(node, 0, node, 0);
				this.syncCode();
				return false;
			}
			else {
				this.syncCode();
			}
		},

		keyup: function() {
			this.$editor.keyup($.proxy(function(e) {
				var key = e.keyCode || e.which;

				if ($.lily.browser('mozilla') && !this.pasteRunning) {
					this.saveSelection();
				}

				// callback as you type
				if (typeof this.options.keyupCallback === 'function') {
					this.options.keyupCallback(this, e);
				}

				// if empty
				if (key === 8 || key === 46) {
					return this.formatEmpty(e);
				}

				// new line p
				if (key === 13 && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
					if ($.lily.browser('webkit')) {
						this.formatNewLine(e);
					}

					// convert links
					if (this.options.convertLinks) {
						this.$editor.linkify();
					}
				}
				this.syncCode();
			}, this));
		},
        observeScroll: function() {
			var scrolltop = $(document).scrollTop();
			var boxtop = this.$box.offset().top;
			var left = 0;

			if (scrolltop > boxtop) {
				var width = '100%';
				if (this.options.fixedBox) {
					left = this.$box.offset().left;
					width = this.$box.innerWidth();
				}

				this.fixed = true;
				this.$toolbar.css({ position: 'fixed', width: width, zIndex: 1005, top: this.options.fixedTop + 'px', left: left });
                this.$toolbar.addClass("fixed");
			}
			else {
				this.fixed = false;
				this.$toolbar.css({ position: 'relative', width: 'auto', zIndex: 1, top: 0, left: left });
                this.$toolbar.removeClass("fixed");
			}
		},
		observeFormatting: function() {
			var parent = this.getCurrentNode();

			this.inactiveAllButtons();

			$.each(this.options.activeButtonsStates, $.proxy(function(i,s) {
				if ($(parent).closest(i,this.$editor.get()[0]).length != 0) {
					this.setBtnActive(s);
				}

			}, this));

			var tag = $(parent).closest(['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'td']);

			if (typeof tag[0] !== 'undefined' && typeof tag[0].elem !== 'undefined' && $(tag[0].elem).size() != 0) {
				var align = $(tag[0].elem).css('text-align');

				switch (align) {
					case 'right':
						this.setBtnActive('alignright');
					break;
					case 'center':
						this.setBtnActive('aligncenter');
					break;
					case 'justify':
						this.setBtnActive('justify');
					break;
					default:
						this.setBtnActive('alignleft');
					break;
				}
			}
		},
		savePreCode: function(html) {
			var pre = html.match(/<pre(.*?)>([\w\W]*?)<\/pre>/gi)
			if (pre !== null) {
				$.each(pre, $.proxy(function(i,s) {
					var arr = s.match(/<pre(.*?)>([\w\W]*?)<\/pre>/i)
					arr[2] = this.encodeEntities(arr[2])
					html = html.replace(s, '<pre' + arr[1] + '>' + arr[2] + '</pre>')
				}, this))
			}
			return html
		},

		encodeEntities: function(str) {
			str = String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
			return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
		},
		getParentNode: function() {
			return $(this.getCurrentNode()).parent()[0]

        },
		syncCode: function() {
			this.$element.val(this.$editor.html());
		},
		// Get elements, html and text
		getCurrentNode: function() {
			if (typeof this.window.getSelection !== 'undefined') {
                var selectedNode = this.getSelectedNode()
                if(selectedNode.tagName === 'BLOCKQUOTE')
                    return selectedNode;
				return this.getSelectedNode().parentNode;
			}
			else if (typeof this.document.selection !== 'undefined') {
				return this.getSelection().parentElement();
			}

        },
        pasteHtmlAtCaret: function (html) {
			var sel, range;
			if (this.document.getSelection) {
				sel = this.window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();
					var el = this.document.createElement("div");
					el.innerHTML = html;
					var frag = this.document.createDocumentFragment(), node, lastNode;
					while (node = el.firstChild) {
						lastNode = frag.appendChild(node);
					}
					range.insertNode(frag);

					if (lastNode) {
						range = range.cloneRange();
						range.setStartAfter(lastNode);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}
				}
			}
			else if (this.document.selection && this.document.selection.type != "Control") {
				this.document.selection.createRange().pasteHTML(html);
			}
		},
		execRun: function(cmd, param) {
			if (cmd === 'formatblock' && $.lily.browser('msie')) {
				param = '<' + param + '>';
			}
			this.document.execCommand(cmd, false, param);
		},
        // BUFFER
		setBuffer: function()
		{
			this.saveSelection();
			this.options.buffer = this.$editor.html();
		},
        // SELECTION AND NODE MANIPULATION
		getFragmentHtml: function (fragment) {
			var cloned = fragment.cloneNode(true);
			var div = this.document.createElement('div');
			div.appendChild(cloned);
			return div.innerHTML;
		},

		extractContent: function() {
			var node = this.$editor.get(0);
			var frag = this.document.createDocumentFragment(), child;
			while ((child = node.firstChild)) {
				frag.appendChild(child);
			}

			return frag;
		},
		execCommand: function(cmd, param) {
			try {
				var parent;
				if (cmd === 'inserthtml') {
					if ($.lily.browser('msie')) {
						this.$editor.focus();
						this.document.selection.createRange().pasteHTML(param);
					}
					else {
						this.pasteHtmlAtCaret(param);
					}
                    this.calcHeight()
				}
				else if (cmd === 'unlink') {
					parent = this.getParentNode();
					if ($(parent).get(0).tagName === 'A') {
						$(parent).replaceWith($(parent).text());
					}
					else {
						this.execRun(cmd, param);
					}
				}
				else if (cmd === 'JustifyLeft' || cmd === 'JustifyCenter' || cmd === 'JustifyRight' || cmd === 'JustifyFull') {
					parent = this.getCurrentNode();
					var tag = $(parent).get(0).tagName;

					if (this.options.iframe === false && $(parent).parents('.redactor_editor').size() == 0) {
						return false;
					}

					var tagsArray = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'TD'];
					if ($.inArray(tag, tagsArray) != -1) {
						var align = false;

						if (cmd === 'JustifyCenter') {
							align = 'center';
						}
						else if (cmd === 'JustifyRight') {
							align = 'right';
						}
						else if (cmd === 'JustifyFull') {
							align = 'justify';
						}

						if (align === false) {
							$(parent).css('text-align', '');
						}
						else {
							$(parent).css('text-align', align);
						}
					}
					else {
						this.execRun(cmd, param);
					}
				}
				else if (cmd === 'formatblock' && param === 'blockquote') {
					parent = this.getCurrentNode();
					if ($(parent).get(0).tagName === 'BLOCKQUOTE') {
						if ($.lily.browser('msie')) {
							var node = $('<p>' + $(parent).html() + '</p>');
							$(parent).replaceWith(node);
						}
						else {
							this.execRun(cmd, 'p');
						}
					}
					else if ($(parent).get(0).tagName === 'P') {
						var parent2 = $(parent).parent();
						if ($(parent2).get(0).tagName === 'BLOCKQUOTE') {
							var node = $('<p>' + $(parent).html() + '</p>');
							$(parent2).replaceWith(node);
							this.setSelection(node[0], 0, node[0], 0);
						}
						else {
							if ($.lily.browser('msie')) {
								var node = $('<blockquote>' + $(parent).html() + '</blockquote>');
								$(parent).replaceWith(node);
							}
							else {
								this.execRun(cmd, param);
							}
						}
					}
					else {
						this.execRun(cmd, param);
					}
				}
				else if (cmd === 'formatblock' && (param === 'pre' || param === 'p')) {
					parent = this.getParentNode();

					if ($(parent).get(0).tagName === 'PRE') {
						$(parent).replaceWith('<p>' +  this.encodeEntities($(parent).text()) + '</p>');
					}
					else {
						this.execRun(cmd, param);
					}
				}
				else {
					if (cmd === 'inserthorizontalrule' && $.lily.browser('msie')) {
						this.$editor.focus();
					}

					if (cmd === 'formatblock' && $.lily.browser('mozilla')) {
						this.$editor.focus();
					}

					this.execRun(cmd, param);
				}

				if (cmd === 'inserthorizontalrule') {
					this.$editor.find('hr').removeAttr('id');
				}

				this.syncCode();

				if (typeof this.options.execCommandCallback === 'function') {
					this.options.execCommandCallback(this, cmd);
				}
			}
			catch (e) { }
		},
		saveSelection: function() {
			this.$editor.focus();

			this.savedSel = this.getOrigin();
			this.savedSelObj = this.getFocus();
		},
		getOrigin: function() {
			var sel;
			if (!((sel = this.getSelection()) && (sel.anchorNode != null))) {
				return null;
			}
			return [sel.anchorNode, sel.anchorOffset];
		},
		getFocus: function() {
			var sel;
			if (!((sel = this.getSelection()) && (sel.focusNode != null))) {
				return null;
			}
			return [sel.focusNode, sel.focusOffset];
		},

        setSelection: function (orgn, orgo, focn, foco) {
			if (focn == null) {
				focn = orgn;
			}
			if (foco == null) {
				foco = orgo;
			}
			if (!$.lily.oldIE()) {
				var sel = this.getSelection();
				if (!sel) {
					return;
				}
				if (sel.collapse && sel.extend) {
					sel.collapse(orgn, orgo);
					sel.extend(focn, foco);
				}
                //IE 9
				else {
					r = this.document.createRange();
					r.setStart(orgn, orgo);
					r.setEnd(focn, foco);

					try {
						sel.removeAllRanges();
					}
					catch (e) {}

					sel.addRange(r);
				}
			}
			else {
				var node = this.$editor.get(0);
				var range = node.document.body.createTextRange();

				this._moveBoundary(node.document, range, false, focn, foco);
				this._moveBoundary(node.document, range, true, orgn, orgo);
				return range.select();
			}
		},

        restoreSelection: function() {
			if (typeof this.savedSel !== 'undefined' && 
                this.savedSel !== null && this.savedSelObj !== null && 
                this.savedSel[0].tagName !== 'BODY') {
				if (this.options.iframe === false && $(this.savedSel[0]).closest('.redactor_editor').size() == 0) {
					this.$editor.focus();
				}
				else {
					if ($.lily.browser('opera')) {
						this.$editor.focus();
					}

					this.setSelection(this.savedSel[0], this.savedSel[1], this.savedSelObj[0], this.savedSelObj[1]);

					if ($.lily.browser('mozilla')) {
						this.$editor.focus();
					}
				}
			}
			else {
				this.$editor.focus();
			}
		},

		// Selection
		getSelection: function() {
			var doc = this.document;

			if (this.window.getSelection) {
				return this.window.getSelection();
			}
			else if (doc.getSelection) {
				return doc.getSelection();
			}
			else {
				return doc.selection.createRange();
			}
			return false;
		},
        getSelectedNode: function() {
			if (typeof this.window.getSelection !== 'undefined') {
				var s = this.window.getSelection();
				if (s.rangeCount > 0) {
					return this.getSelection().getRangeAt(0).commonAncestorContainer;
				}
				else {
					return false;
				}
			}
			else if (typeof this.document.selection !== 'undefined') {
				return this.getSelection();
			}
		},
        // BUTTONS MANIPULATIONS
		getBtn: function(key) {
			if (this.options.toolbar === false) {
				return false;
			}
			return $(this.$toolbar.find('a.editor_btn_' + key));
		},
        setBtnActive: function(key) {
			this.getBtn(key).addClass('editor_act');
		},
        setBtnInactive: function(key) {
			this.getBtn(key).removeClass('editor_act');
		},
		inactiveAllButtons: function() {
			$.each(this.options.activeButtons, $.proxy(function(i,s) {
				this.setBtnInactive(s);
			}, this));
		},
		formatNewLine: function(e) {
			var parent = this.getParentNode();

			if (parent.nodeName === 'DIV' && parent.className === 'editor_editor') {
				var element = $(this.getCurrentNode());

				if (element.get(0).tagName === 'DIV' && (element.html() === '' || element.html() === '<br>')) {
					var newElement = $('<p>').append(element.clone().get(0).childNodes);
					element.replaceWith(newElement);
					newElement.html('<br />');
					this.setSelection(newElement[0], 0, newElement[0], 0);
				}
			}
		},

		toggle: function() {

            if(this.$element.css("display") == "none") {
				var height = this.$editor.innerHeight();

				this.$editor.hide();

				html = this.$editor.html();
				//html = $.trim(this.formatting(html));

				this.$element.height(height).val(html).show().focus();

				this.setBtnActive('html');
                return
            }
			var html = this.$element.val();

			// set code
			this.$editor.html(html).show();

			if (this.$editor.html() === '') {
				this.setCode(this.options.emptyHtml);
			}

			this.$editor.focus();

			this.setBtnInactive('html');
            this.$editor.show()
			this.$element.hide();
		},
		imageUploadCallback: function(data) {
			this._imageSet(data);
		},
		_imageSet: function(json, link) {
			//this.restoreSelection()
			if (json !== false) {
				var html = ''
				if (link !== true) {	
					html = '<p><img src="' + $.lily.contextPath + '/image/' + json.imageUrl + '" /></p>'
				}
				else {
					html = json
				}
				this.execCommand('inserthtml', html)
			}
			this.windowClose()
		},
		windowClose: function() {
			this.currentWindow.close()
		},
        showImage: function(e) {
        	this.saveSelection()
            var contentStr = '<div class="image-uploader">'
                + '<div class="section img-uploader-tab">'
                + '<a href="javascript:;" class="tab-nav selected btn btn-x"  data-toggle="button-display" data-content="#window-upload-image" data-hidden="#window-link-image" >上传图片</a> 或 '
                + '<a href="javascript:;" class="tab-nav btn btn-x" data-toggle="button-display" data-content="#window-upload-image" data-hidden="#window-link-image" >引用站外图片</a>'
                + '</div>'
                + '<div class="tab-content inline" id="window-upload-image">'
                + '<input type="file" name="file" style="opacity:0;height:80;cursor:pointer;font-size:0;position:absolute;">'
                + '<a href="javascript:;" class="btn btn-primary">选择图片</a>'
                + '</div>'
                + '<div class="tab-content" id="window-link-image" style="display:none">'
                + '<input type="text" autocomplete="off" class="text-input" name="upload_file_url">'
                + '<a href="javascript:;" class="btn btn-primary">确认</a>'
                + '</div>'
            var self = this
            function bindFileUpload($element) {
            	$('[type="file"]', $element).bind("change", function() {
                    $.ajaxFileUpload({
                        url: $.lily.contextPath + '/image/',
                        data: self.options.dataPost,
                        secureuri: false,
                        fileElement: $('[type="file"]'),
                        dataType: 'json',
                        success: function (reponseData, status) {      
                        	self.imageUploadCallback(reponseData)
                        }
                    })
                })
            }
            this.currentWindow = $.openWindow({
                windowClass:'window',
                backdrop: true,
                allowMinimize: false,
                btnClass: 'float-btn',
                showFun: null,
                title: '插入图片',
                content: contentStr,
                source: $(e.target),
                afterFun: bindFileUpload
            });
        },
		paragraphy: function (str) {
			str = $.trim(str)
			if (str === '' || str === '<p></p>') {
				return this.options.emptyHtml
			}
			if (this.options.convertDivs) {
				str = str.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '<p>$2</p>')
			}

			var X = function(x, a, b) { return x.replace(new RegExp(a, 'g'), b); }
			var R = function(a, b) { return X(str, a, b); }

			var blocks = '(table|thead|tfoot|caption|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|form|blockquote|address|math|style|script|object|input|param|p|h[1-6])'

			str += '\n'

			R('<br />\\s*<br />', '\n\n')
			R('(<' + blocks + '[^>]*>)', '\n$1')
			R('(</' + blocks + '>)', '$1\n\n');
			R('\r\n|\r', '\n'); // newlines
			R('\n\n+', '\n\n'); // remove duplicates
			R('\n?((.|\n)+?)$', '<p>$1</p>\n'); // including one at the end
			R('<p>\\s*?</p>', ''); // remove empty p
			R('<p>(<div[^>]*>\\s*)', '$1<p>');
			R('<p>([^<]+)\\s*?(</(div|address|form)[^>]*>)', '<p>$1</p>$2');
			R('<p>\\s*(</?' + blocks + '[^>]*>)\\s*</p>', '$1');
			R('<p>(<li.+?)</p>', '$1');
			R('<p>\\s*(</?' + blocks + '[^>]*>)', '$1');
			R('(</?' + blocks + '[^>]*>)\\s*</p>', '$1');
			R('(</?' + blocks + '[^>]*>)\\s*<br />', '$1');
			R('<br />(\\s*</?(p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)', '$1');

			// pre
			if (str.indexOf('<pre') != -1) {
				R('(<pre(.|\n)*?>)((.|\n)*?)</pre>', function(m0, m1, m2, m3)
				{
					return X(m1, '\\\\([\'\"\\\\])', '$1') + X(X(X(m3, '<p>', '\n'), '</p>|<br />', ''), '\\\\([\'\"\\\\])', '$1') + '</pre>';
				});
			}
			return R('\n</p>$', '</p>')
		},

        // REMOVE TAGS
		stripTags: function(html) {
			var allowed = this.options.allowedTags;
			var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
			return html.replace(tags, function ($0, $1) {
				return $.inArray($1.toLowerCase(), allowed) > '-1' ? $0 : '';
			});
		},

        // PASTE CLEANUP
		pasteCleanUp: function(html) {
			var parent = this.getParentNode();
			// clean up pre
			if ($(parent).get(0).tagName === 'PRE') {
				html = this.cleanupPre(html);
				this.pasteCleanUpInsert(html);
				return true;
			}

			// remove comments and php tags
			html = html.replace(/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi, '');

			// remove nbsp
			html = html.replace(/(&nbsp;){2,}/gi, '&nbsp;');

			// remove google docs marker
			html = html.replace(/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi, "$2");

			// strip tags
			html = this.stripTags(html);

			// prevert
			html = html.replace(/<td><\/td>/gi, '[td]');
			html = html.replace(/<td>&nbsp;<\/td>/gi, '[td]');
			html = html.replace(/<td><br><\/td>/gi, '[td]');
			html = html.replace(/<a(.*?)href="(.*?)"(.*?)>([\w\W]*?)<\/a>/gi, '[a href="$2"]$4[/a]');
			html = html.replace(/<iframe(.*?)>([\w\W]*?)<\/iframe>/gi, '[iframe$1]$2[/iframe]');
			html = html.replace(/<video(.*?)>([\w\W]*?)<\/video>/gi, '[video$1]$2[/video]');
			html = html.replace(/<audio(.*?)>([\w\W]*?)<\/audio>/gi, '[audio$1]$2[/audio]');
			html = html.replace(/<embed(.*?)>([\w\W]*?)<\/embed>/gi, '[embed$1]$2[/embed]');
			html = html.replace(/<object(.*?)>([\w\W]*?)<\/object>/gi, '[object$1]$2[/object]');
			html = html.replace(/<param(.*?)>/gi, '[param$1]');
			html = html.replace(/<img(.*?)style="(.*?)"(.*?)>/gi, '[img$1$3]');

			// remove attributes
			html = html.replace(/<(\w+)([\w\W]*?)>/gi, '<$1>');

			// remove empty
			html = html.replace(/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi, '');
			html = html.replace(/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi, '');

			// revert
			html = html.replace(/\[td\]/gi, '<td>&nbsp;</td>');
			html = html.replace(/\[a href="(.*?)"\]([\w\W]*?)\[\/a\]/gi, '<a href="$1">$2</a>');
			html = html.replace(/\[iframe(.*?)\]([\w\W]*?)\[\/iframe\]/gi, '<iframe$1>$2</iframe>');
			html = html.replace(/\[video(.*?)\]([\w\W]*?)\[\/video\]/gi, '<video$1>$2</video>');
			html = html.replace(/\[audio(.*?)\]([\w\W]*?)\[\/audio\]/gi, '<audio$1>$2</audio>');
			html = html.replace(/\[embed(.*?)\]([\w\W]*?)\[\/embed\]/gi, '<embed$1>$2</embed>');
			html = html.replace(/\[object(.*?)\]([\w\W]*?)\[\/object\]/gi, '<object$1>$2</object>');
			html = html.replace(/\[param(.*?)\]/gi, '<param$1>');
			html = html.replace(/\[img(.*?)\]/gi, '<img$1>');


			// convert div to p
			if (this.options.convertDivs) {
				html = html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '<p>$2</p>');
			}

			// remove span
			html = html.replace(/<span>([\w\W]*?)<\/span>/gi, '$1');

			html = html.replace(/\n{3,}/gi, '\n');

			// remove dirty p
			html = html.replace(/<p><p>/gi, '<p>');
			html = html.replace(/<\/p><\/p>/gi, '</p>');

			// FF fix
			if ($.lily.browser('mozilla')) {
				html = html.replace(/<br>$/gi, '');
			}
			this.pasteCleanUpInsert(html);
		},

        pasteCleanUpInsert: function(html) {
			this.execCommand('inserthtml', html);

			if (this.options.autoresize === true) {
				$(this.document.body).scrollTop(this.saveScroll);
			}
			else {
				this.$editor.scrollTop(this.saveScroll);
			}
		},

        show: function() {
        },

        resetForm: function() {
        }
    }

    $.fn.editor = function ( option ) {
       return this.each(function () {
           var $this = $(this), 
               data = $this.data('editor'), 
               options = typeof option == 'object' && option
           if (!data) {
               $this.data('editor', (data = new Editor(this, options)));
           }
       });
    }
    var localization = {
    	html: 'HTML',
    	video: 'Insert Video',
    	image: 'Insert Image',
    	table: 'Table',
    	link: 'Link',
    	link_insert: 'Insert link',
    	unlink: 'Unlink',
    	formatting: 'Formatting',
    	paragraph: 'Paragraph',
    	quote: '引用',
    	code: 'Code',
    	header1: 'Header 1',
    	header2: 'Header 2',
    	header3: 'Header 3',
    	header4: 'Header 4',
    	bold:  '粗体',
    	italic: '斜体',
    	fontcolor: 'Font Color',
    	backcolor: 'Back Color',
    	unorderedlist: '无序列表',
    	orderedlist: '有序列表',
    	cancel: 'Cancel',
    	insert: 'Insert',
    	save: 'Save',
    	_delete: '删除',
    	insert_table: 'Insert Table',
    	insert_row_above: 'Add Row Above',
    	insert_row_below: 'Add Row Below',
    	insert_column_left: 'Add Column Left',
    	insert_column_right: 'Add Column Right',
    	delete_column: 'Delete Column',
    	delete_row: 'Delete Row',
    	delete_table: 'Delete Table',
    	rows: 'Rows',
    	columns: 'Columns',
    	add_head: 'Add Head',
    	delete_head: 'Delete Head',
    	title: 'Title',
    	image_position: 'Position',
    	none: 'None',
    	left: 'Left',
    	right: 'Right',
    	image_web_link: 'Image Web Link',
    	text: 'Text',
    	mailto: 'Email',
    	web: 'URL',
    	video_html_code: 'Video Embed Code',
    	file: 'Insert File',
    	upload: 'Upload',
    	download: 'Download',
    	choose: 'Choose',
    	or_choose: 'Or choose',
    	drop_file_here: 'Drop file here',
    	align_left:	'Align text to the left',
    	align_center: 'Center text',
    	align_right: 'Align text to the right',
    	align_justify: 'Justify text',
    	horizontalrule: 'Insert Horizontal Rule',
    	deleted: '删除',
    	anchor: 'Anchor',
    	link_new_tab: 'Open link in new tab',
    	underline: 'Underline',
    	alignment: 'Alignment',
        outdent: '减少缩进',
        indent: '增加缩进'
    };


    $.fn.editor.defaults = {
        buttons: [
            'bold', 'italic', 'deleted', '|', 
            'unorderedlist', 'orderedlist', '|',
            'blockquote'], 
		activeButtons: ['deleted', 'italic', 'bold', 'underline', 'unorderedlist', 'orderedlist', 'blockquote'], 
		activeButtonsStates: {
			b: 'bold',
			strong: 'bold',
			i: 'italic',
			em: 'italic',
			del: 'deleted',
			strike: 'deleted',
			ul: 'unorderedlist',
			ol: 'orderedlist',
			u: 'underline',
			blockquote: 'blockquote'
		},
		toolbar: {
			html:
			{
				title: localization.html,
				func: 'toggle'
			},
			bold:
			{
				title: localization.bold,
				exec: 'bold'
			},
			italic:
			{
				title: localization.italic,
				exec: 'italic'
			},
			deleted:
			{
				title: '<strike>' + localization.deleted +  '</strike>' ,
				exec: 'strikethrough'
			},
			underline:
			{
				title: localization.underline,
				exec: 'underline'
			},
			unorderedlist:
			{
				title: localization.unorderedlist,
				exec: 'insertunorderedlist'
			},
			orderedlist:
			{
				title: localization.orderedlist,
				exec: 'insertorderedlist'
			},
			outdent:
			{
				title: localization.outdent,
				exec: 'outdent'
			},
			indent:
			{
				title: localization.indent,
				exec: 'indent'
			},
			image:
			{
				title: localization.image,
				func: 'showImage'
			},
			video:
			{
				title: localization.video,
				func: 'showVideo'
			},
			file:
			{
				title: localization.file,
				func: 'showFile'
			},
            blockquote:
		    {
				title: localization.quote,
				exec: 'formatblock',
				className: 'redactor_format_blockquote'
			}
        },
        css: '/static/css/main.css',
        emptyHtml: '<p><br /></p>',
        allowedTags: ["form", "input", "button", "select", "option", "datalist", "output", "textarea", "fieldset", "legend",
					"section", "header", "hgroup", "aside", "footer", "article", "details", "nav", "progress", "time", "canvas",
					"code", "span", "div", "label", "a", "br", "p", "b", "i", "del", "strike", "u",
					"img", "video", "source", "track", "audio", "iframe", "object", "embed", "param", "blockquote",
					"mark", "cite", "small", "ul", "ol", "li", "hr", "dl", "dt", "dd", "sup", "sub",
					"big", "pre", "code", "figure", "figcaption", "strong", "em", "table", "tr", "td",
					"th", "tbody", "thead", "tfoot", "h1", "h2", "h3", "h4", "h5", "h6"],
        fixed: true,
        fixedBox: true,
        fixedTop: 5
    }
    $.fn.editor.Constructor = Editor 
    
}(window.jQuery)
