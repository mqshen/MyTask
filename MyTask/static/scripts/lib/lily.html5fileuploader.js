/**
 * jQuery file uploader - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 * 
 */  


(function( $, undefined ) {

$.extend( $.lily, {
    uploadFile: function(options) {
        var xhr = new XMLHttpRequest();
		if (xhr.upload ) {
            var file = options.file

            if(options.thumbnail && options.isImage) {
                var imageReader = new FileReader();
                imageReader.onload = (function(aFile) {
                    return function(e) {
                        options.thumbnail.attr("src", e.target.result)

                    };
                })(file);
                imageReader.readAsDataURL(file);
            }

            var dataType = 'json' 
            if(options.dataType)
                dataType = options.dataType
			// progress bar
            if(options.progress)
			    xhr.upload.addEventListener("progress", options.progress, false);

			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
                    if(xhr.status == 200)
                        var responseText = xhr.responseText
                        if(dataType === 'json')
                            responseText = $.parseJSON(responseText)
                        options.callback(responseText)
				}
			};

			// start upload
			xhr.open("POST", options.url, true);
            xhr.setRequestHeader("Content-type", file.type)
			xhr.setRequestHeader("X_FILENAME", encodeURIComponent(file.name));
			xhr.send(file);
		}
    }
})
})( jQuery ); 
