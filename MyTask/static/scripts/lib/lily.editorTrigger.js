!function($) {

	"use strict"; // jshint ;_;

	var EditorTrigger = function(element, options) {
		this.$element = $(element)
		this.options = $.extend({}, $.fn.editorTrigger.defaults, options)
		this.$target = this.$element.closest('.editable_container')
	}

	EditorTrigger.prototype = {
		init: function() {
            this.$editorContainer = this.$target.clone()
            this.$editorContainer.addClass("edit_mode") 
            var $form = $('<form class="' + this.$target.attr("data-target-class") + '" method="post" action="' 
                + this.$target.attr("href") + '" data-save="true"></form>')
			var self = this
			function doResponse(data) {
                $('[data-toggle=select]', self.$editorContainer).each(function(){
					var $this = $(this)
                    $this.attr("data-orgin-statues","selected")
                })
				$('.editable,.echo', self.$target).each(function(){
					var $this = $(this)
                    $.lily.fillHtml($this, data)
				})
				self.toggle()
                var myResponse = self.$element.data("doResponse")
                if(myResponse)
                    myResponse(data, self.$element, self.$target)
			}
			$form.data('doResponse', doResponse);

                
			$('.editable', this.$editorContainer).each(function(){
				var $this = $(this)
				var $obj;
				var dataType = $this.attr("data-type");
				if(dataType == "textarea") {
					$obj = $('<textarea style="resize: none; overflow: hidden; min-height: 18px;" data-toggle="remote"></textarea>')
                    if($this.attr("name") === "content")
                        $obj.width("778px")
				    $obj.val($this.html().trim())
				}
                else if(dataType == "html") {
                    $obj = $this.clone()
                }
                else if(dataType == "image") {
                    var $this = $(this)
                    var result = '<li class="image selected" data-toggle="select" name="attachment" data-content="' + $this.attr("data-content")
                        + '" data-orgin-statues="selected"><img class="thumbnail" src="' + $this.attr("src")
                        + '"><a class="remove" data-toggle="remove" data-content="f" href="javascript:;"><span>Remove</span></a>'
                        + '<span class="name">1.jpg</span><div class="progress"><div style="width: 100%;"></div></div></li>'
                    $obj = $(result)
                }
				else if(dataType == "file") {
                    var $this = $(this)
                    var result = '<li class="selected" data-toggle="select" name="attachment" data-content="' + $this.attr("data-content")
                        + '" data-orgin-statues="selected"><a class="remove" data-toggle="remove" data-content="f" href="javascript:;"><span>Remove</span></a>'
                        + '<div class="icon"><img src="' + $this.attr("src") + '" class="file_icon" width="32" height="32">'
                        + '</div><span class="name">' + '2.pdf' + '</span><div class="progress"><div style="width: 100%;"></div></div></li>'
                    $obj = $(result)
				}
				else {
					$obj = $('<input type="text" data-toggle="remote">')
				    $obj.val($this.html().trim())
				}
				$obj.attr("name", $this.attr("name"))
				$obj.attr("id", $this.attr("id"))
                var dataAppend = $this.attr("data-append")
                if(dataAppend)
                    $obj.appendTo($(dataAppend, $form))
                else
                    $obj.appendTo($form)
                if(!self.focusElement && dataType == 'input')
                    self.focusElement = $obj
			})
            this.$editorContainer.css("display", "none")
            this.$editorContainer.empty()
            $form.appendTo(this.$editorContainer)
			this.$editorContainer.insertAfter(this.$target)

            var $buttonObj = $('<p class="submit">'
                + '<button tabindex="1" class="action_button" id="btn-post" data-toggle="submit" data-disable-with="正在保存...">保存</button>' 
                + '<a tabindex="2" href="javascript:;" class="btn btn-x" id="link-cancel-post">取消</a></p>')
			$buttonObj.appendTo($form)
			var self = this
			$('#link-cancel-post', this.$editorContainer).click(function(){
				self.toggle()
			})

            function fileupload(event) {
		        var $this = $(event.target)
                var file = $this.get(0).files[0]
                var $attachmentsContainer = $('#attachments_container', $form)

                var isImage = file.type.indexOf("image") > -1
                var fileObj = '<li class="image uploading selected" data-toggle="select" name="attachment">'
                    + '<a class="remove" data-toggle="remove" href="javascript:;"><span>Remove</span></a>'

                if(!isImage) {
                    fileObj += '<div class="icon"><img src="/static/images/document.png" class="file_icon" width="32" height="32"></div>' 
                }
                fileObj += '<span class="name">' + file.name + '</span></li>'

                var $fileObj = $(fileObj)

                var $progressBar = $('<div class="progress"></div>')
                var $progress = $('<div>')
                $progressBar.append($progress) 

                $fileObj.append($progressBar)

                var $image = $('<img class="thumbnail">')
                if(isImage)
                    $fileObj.prepend($image)

                function fileUploadCallback(data) {
                    $fileObj.attr("data-content", data.url)
                    $progress.css("width", '100%')
                    $fileObj.removeClass("uploading")
                }
                function progress(e) {
                    var pc = parseInt(100 - (e.loaded / e.total * 100));
                    $progress.css("width", pc + '%')
                }


                $attachmentsContainer.append($fileObj)
                $.lily.uploadFile({
                    url: '/attachment',
                    file: file,
                    progress: progress,
                    callback: fileUploadCallback,
                    thumbnail: $image,
                    isImage: isImage
                }) 
            }
            $("#messageAttachment", $form).bind("change", fileupload)

			this.initialized = true
		},
		
		fileUploadCallback: function(responseData) {
			
			if(responseData.file.imageFile) {
				var imageFile = $('<div class="file selected" data-toggle="select" data-content="'
					+ responseData.file.id + '" name="files"><div class="file-thumb"><a href="javascript:;" title="点击预览">'
					+ '<img class="image" alt="" src="' + $.lily.contextPath + '/attachment/' + responseData.file.url + '">'
					+ '</a></div>'
					+ '<a class="remove" data-toggle="remove" href="javascript:;">&nbsp;</a>'
					+ '</div>')
				var fileEditContainer = $('.file-images', this.$fileEditContainer)
				fileEditContainer.prepend(imageFile)
			}
			else {
				var otherFile = $('<div class="file selected" data-toggle="select" data-content="'
					+ responseData.file.id + '" name="files"><div class="file-thumb">'
					+ '<a href="' + $.lily.contextPath + '/attachment/' + responseData.file.url + '">'
					+ '<img alt="README" src="' + $.lily.contextPath + '/resources/images/file_extension_others.png"></a></div>'
					+ '<a class="remove" data-toggle="remove" href="javascript:;">&nbsp;</a>'
					+ '</div>')
				var fileEditContainer = $('.file-others', this.$fileEditContainer)
				fileEditContainer.prepend(otherFile)
			}
			
			
		},
		
		toggle: function() {
			if(!this.initialized)
				this.init()
			this.$target.toggle()
			this.$editorContainer.toggle()
            $('textarea[name=content]', this.$editorContainer).editor()
            if(this.focusElement)
                this.focusElement.focus()
		},

        distory: function() {
            this.$editorContainer.remove() 
            this.$editorContainer = null
            this.$target = null
            this.$element.data("editorTrigger", null)
        }

	}

	$.fn.editorTrigger = function(option) {
		return this
				.each(function() {
					var $this = $(this), data = $this.data('editorTrigger'), options = typeof option == 'object' && option
					if (!data)
						$this.data('editorTrigger', (data = new EditorTrigger(this, options)))
					data.toggle()
				})
	}

	$.fn.editorTrigger.defaults = {
		loadingText : 'loading...'
	}

	$.fn.editorTrigger.Constructor = EditorTrigger

	$(document).on('click.button.data-api', '[data-toggle^=editorTrigger]',
			function(e) {
				var $btn = $(e.target)
				e.preventDefault()
				$btn.editorTrigger("submit")
			})

}(window.jQuery);
