import $ from 'jquery'


var parentContainerId = "textDescription"

	if(!window.CurrentSelection){
		CurrentSelection = {}
	}

	CurrentSelection.Selector = {}

	//get the current selection
	CurrentSelection.Selector.getSelected = function(){
		var sel = '';
		if(window.getSelection){
			sel = window.getSelection()
		}
		else if(document.getSelection){
			sel = document.getSelection()
		}
		else if(document.selection){
			sel = document.selection.createRange()
		}
		return sel
	}
	//function to be called on mouseup
	CurrentSelection.Selector.mouseup = function(){

		var st = CurrentSelection.Selector.getSelected()
		if(document.selection && !window.getSelection){
			var range = st
			range.pasteHTML("<span class='selectedText'>" + range.htmlText + "</span>");
		}
		else{
			var range = st.getRangeAt(0)
			var newNode = document.createElement('span');
			newNode.setAttribute('class', 'selectedText');
			range.surroundContents(newNode);
			//
		   var getTitle = newNode.innerHTML;
		   newNode.setAttribute("title", getTitle);

		   //
		   var popDiv = document.createElement('span');
		   popDiv.setAttribute('class', 'popDiv');
		   popDiv.innerHTML = getTitle;

		   if(newNode.innerHTML.length > 0) {
		    newNode.appendChild(popDiv);
		   }
		   //Remove Selection: To avoid extra text selection in IE
		   if (window.getSelection) {
		     window.getSelection().removeAllRanges();
		   }
	       else if (document.selection){
	        document.selection.empty();
	       }
	       //
		}
	}

	$(function(){

		$("#"+parentContainerId).on('mouseup', function(){
			$('span.selectedText').contents().unwrap();
			$(this).find('span.popDiv').remove();
		});

		$("#"+parentContainerId).bind("mouseup",CurrentSelection.Selector.mouseup);
	})
