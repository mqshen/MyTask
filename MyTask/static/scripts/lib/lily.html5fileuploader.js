/**
 * jQuery file uploader - v1.0
 * auth: shenmq
 * E-mail: shenmq@126.com
 * website: shenmq.github.com
 * 
 */  

!function(){
    "use strict"

    var FileUploader = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.fileuploader.defaults, options)
        this.init()
    }


    FileUploader .prototype = {
        constructor: FileUploader,

        init: function() {
            var self = this
            this.$target = $('[type=file]', this.$element)
            this.$target.change(function(e) {
                self.fileupload(e)
            })
        },

        progress: function(e) {
            var pc = parseInt((e.loaded / e.total * 100));
            this.$progress.css("width", pc + '%')
        },

        fileUploadCallback: function (data) {
			if(data.returnCode != '0' && data.returnCode != '000000') {
                alert(data.errorMessage);
                $fileObj.remove()
                return;
			}
            if(this.options.thumbnail) {
                this.$fileObj.attr("data-content", data.url)
                this.$progress.css("width", '100%')
                this.$fileObj.removeClass("uploading")
            }
        },

        fileupload: function(event) {
            this.file = this.$target.get(0).files[0]
            this.isImage = this.file.type.indexOf("image") > -1
            if(this.options.thumbnail) {
                var $attachmentsContainer = $('#attachments_container', this.$element)

                var fileObj = '<li class="image uploading selected" data-toggle="select" name="attachment">'
                    + '<a class="remove" data-toggle="remove" href="javascript:;"><span>Remove</span></a>'

                if(!this.isImage) {
                    fileObj += '<div class="icon"><img src="/static/images/filetype/file.png" class="file_icon" width="32" height="32"></div>' 
                }
                fileObj += '<span class="name">' + this.file.name + '</span></li>'

                this.$fileObj = $(fileObj)

                var $progressBar = $('<div class="progress"></div>')
                this.$progress = $('<div>')
                $progressBar.append(this.$progress) 

                this.$fileObj.append($progressBar)

                this.$image = $('<img class="thumbnail">')
                if(this.isImage)
                    $fileObj.prepend(this.$image)
                $attachmentsContainer.append(this.$fileObj)
            }
            else {
                this.$image = $('img' , this.$element)
            }

            this.uploadFile() 
        },

        uploadFile: function() {
            var self = this
            var xhr = new XMLHttpRequest();
	    	if (xhr.upload ) {

                if(this.isImage) {
                    var imageReader = new FileReader();
                    imageReader.onload = (function(aFile) {
                        return function(e) {
                            self.$image.attr("src", e.target.result)
                        };
                    })(this.file);
                    imageReader.readAsDataURL(this.file);
                }

                var dataType = 'json' 
                if(this.options.dataType)
                    dataType = options.dataType
	    		// progress bar
                if(this.options.thumbnail) {
	    		    xhr.upload.addEventListener("progress", 
                        function(e){
                            self.progress(e)
                        }, 
                        false);
                }

	    		// file received/failed
	    		xhr.onreadystatechange = function(e) {
	    			if (xhr.readyState == 4) {
                        if(xhr.status == 200)
                            var responseText = xhr.responseText
                            if(dataType === 'json')
                                responseText = $.parseJSON(responseText)
                            self.fileUploadCallback(responseText)
	    			}
	    		};

	    		// start upload
	    		xhr.open("POST", this.options.url, true);
                xhr.setRequestHeader("Content-type", this.file.type)
	    		xhr.setRequestHeader("X_FILENAME", encodeURIComponent(this.file.name));
	    		xhr.send(this.file);
	    	}
        }
    }

    $.fn.fileuploader = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('fileuploader')
                , options = typeof option == 'object' && option
            if (!data) $this.data('fileuploader', (data = new FileUploader(this, options)))
        })
    }

    $.fn.fileuploader.defaults = {
        thumbnail: true
    }

    $.fn.fileuploader.Constructor = FileUploader 
}( jQuery ); 
