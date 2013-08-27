!function(){

    "use strict"

    var AppendForm = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.form.defaults, options)
    }

    AppendForm.prototype = {
        constructor: AppendForm,

        doReponseTodoItem: function(responseData) {
        	var workerName = ''
        	var deadLine = ''
        	if(responseData.todoItem.worker)
        		workerName = responseData.todoItem.worker.name 
            if(responseData.todoItem.deadLine) {
            	deadLine = responseData.todoItem.deadLine 
            	deadLine = $.lily.format.formatDate(deadLine)
            }
            var contentStr = '<li class="todo" ><div class="todo-actions actions"><div class="inr">' + 
                '<a href="' + responseData.teamId + '/project/' + responseData.projectId + '/list/' + responseData.listId + 'item/' + responseData.todoItem.id + '/running" class="run" title="标记成正在进行中">执行</a>' +
                '<a href="' + responseData.teamId + '/project/' + responseData.projectId + '/list/' + responseData.listId + 'item/' + responseData.todoItem.id + '/pause" class="pause" title="暂停">暂停</a>' +
                '<a href="' + responseData.teamId + '/project/' + responseData.projectId + '/list/' + responseData.listId + 'item/' + responseData.todoItem.id + '/edit" class="edit" title="编辑">编辑</a>' +
                '<a href="' + responseData.teamId + '/project/' + responseData.projectId + '/list/' + responseData.listId + 'item/' + responseData.todoItem.id + '/destroy" class="del" title="删除">删除</a>' +
		        '</div></div>' +
	            '<div class="todo-wrap">' +
	    	    '<input type="checkbox" name="todo-done">' +
                '<span class="todo-content">' +
			    '<span>' + responseData.todoItem.title + '</span>' +
                '<a href="' + responseData.teamId + '/project/' + responseData.projectId + '/todoList/' + responseData.listId + '/todoItem/' + responseData.todoItem.id + '">' + responseData.todoItem.title + '</a>' +
		        '</span>' +
			    '<a href="javascript:;" class="label todo-assign-due " data-toggle="popover" data-conent="#tpl-todo-popover">' + 
			    '<span class="assignee">' + workerName + '&nbsp;</span>' + 
			    '<span class="due">' + deadLine + '</span>' + 
			    '</a>' +
	            '</div>' +
                '</li>'
            $(contentStr).appendTo('#todos-uncompleted-container-' + responseData.todoItem.todoListId)
        },

        append: function() {

            this.$element.parent().css("display","none")
            if(this.appended) {
                this.$content.toggle()
                return
            }
            this.appended = true
            var originObj = $(this.$element.attr("data-content"))
            var appendObj = originObj.clone()
            var originAction = $('form', originObj).attr('action')
            var dataUrl = this.$element.attr("data-url")
            var dataId = this.$element.attr("data-id")
            appendObj.attr("id", originObj.attr("id") + dataId)

            this.$form =  $('form', appendObj)
            this.$form.attr('action', originAction + dataUrl)
            this.$form.data("doResponse", this.doReponseTodoItem)

            var hiddenButton = $('[data-toggle="button-display"]', appendObj)
            hiddenButton.attr('data-hidden', hiddenButton.attr('data-hidden') + dataId)
            hiddenButton.attr('data-content', '#' + this.$element.parent().attr("id"))
            this.$content = appendObj 
            appendObj.appendTo(this.$element.parent().parent())
            appendObj.css("display","block")
        },

        resetForm: function() {
		    this.$submitButton.attr("disabled", false).text(this.oldText)
            this.$element[0].reset()
        }

    }

    $.fn.appendForm = function ( option ) {
       return this.each(function () {
           var $this = $(this), 
               data = $this.data('appendForm'), 
               options = typeof option == 'object' && option;
           if (!data) {
               $this.data('appendForm', (data = new AppendForm(this, options)));
           }
           if (option == 'append') 
               data.append();
       });
   }

   $.fn.appendForm.defaults = {
       loadingText: 'loading...'
   }

   $.fn.appendForm.Constructor = AppendForm 

   $(document).on('click.form.data-api', '[data-toggle^=append]', function (e) {
        var $btn = $(e.target)
        $btn.appendForm("append")
   })
}(window.jQuery)
