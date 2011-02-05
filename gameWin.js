function printfire()
{
    if (document.createEvent)
    {
        printfire.args = arguments;
        var ev = document.createEvent("Events");
        ev.initEvent("printfire", false, true);
        dispatchEvent(ev);
    }
}

function getHTTPObject() {
var xmlhttp;
/*@cc_on
@if (@_jscript_version >= 5)
try {
xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
} catch (e) {
try {
xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
} catch (E) {
xmlhttp = false;
}
}
@else
xmlhttp = false;
@end @*/
if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
try {
xmlhttp = new XMLHttpRequest();
} catch (e) {
xmlhttp = false;
}
}
return xmlhttp;
}

var emergencyhttp = getHTTPObject();
var http2 = getHTTPObject();
var http3 = getHTTPObject();

function stripSpaces(text) {
	var newText = text;
	while(newText.indexOf(' ')==0) {
		newText = newText.substring(1);
	}

	while(newText.lastIndexOf(' ')==(newText.length-1)) {
		newText = newText.substring(0,newText.length-1);
	}
	return newText;
}

function replaceAll(string,finder,replacer) {
	var newstr = string;
	while(newstr.indexOf(finder)!=-1) {
		newstr = newstr.replace(finder,replacer);
	}
	return newstr;
}

function chatSubmit() {
	// use http2 to submit to chat.php
	if(document.chatForm.chatBox.value!=null) document.chatForm.chatBox.value = stripSpaces(document.chatForm.chatBox.value);
	if(document.chatForm.chatBox.value==null || document.chatForm.chatBox.value=="" || document.chatForm.chatBox.value=="[chat messages here]") return false;
	var boxVal = document.chatForm.chatBox.value;
	document.chatForm.chatBox.disabled = true;
	document.chatForm.chatBox.value = "[transmitting...]";
	boxVal = replaceAll(boxVal," ","+");

	http2.open("GET","action.php?id=4&msg="+boxVal,true);
	http2.onreadystatechange = function () {
		if(http2.readyState == 4) {
			if(http2.status == 200) {
				// it seems to be fine
				if(http2.responseText == "0") {
					alert("You aren't logged in yet!");
				} else if(http2.responseText == "1") {
					alert("A database error occurred.");
				} else {
					document.chatForm.chatBox.value = "";
					chatBoxBlur(); // reset it to the default
					chatUpdate();
				}
			} else {
				printfire("invalid response:\n"+http2.responseText);
				document.chatForm.chatBox.value = "[error in transmission]";
			}
			document.chatForm.chatBox.disabled = false;
			//document.chatForm.chatBox.focus();
		}
	};
	http2.send("");
}
var chatBoxInFocus = false;
function chatBoxFocus() {
	chatBoxInFocus = true;
	if(document.chatForm.chatBox.value=="[chat messages here]") {
		document.chatForm.chatBox.value = "";
	}
}

function chatBoxBlur() {
	//if(document.chatForm.chatBox.value=="") {
		//document.chatForm.chatBox.style.color="#777777";
		//document.chatForm.chatBox.value="[chat messages here]";
	//}
	chatBoxInFocus = false;
}

function chatUpdate() {
	http3.open("GET","chat.php",true);
	http3.onreadystatechange = function () {
		if(http3.readyState == 4) {
			if(http3.status == 200) {
				if(http3.responseText == "1") {
					//setTimeout(chatUpdate,60000);
					alert("Database error occurred while attempting to update the chat box.\nRetrying in 60 seconds...");
					printfire("Database error:\n"+http3.responseText);
					// don't setTimeout
				} else if(http3.responseText == "0") {
					// not logged in yet
					// so just wait
					//setTimeout(chatUpdate,2000);
				} else {
					// update the box, and setTimeout again
					var newValue = "<font size=\"-2\">";
					var responseRows = http3.responseText.split("\n");
					for(var k=0;k<responseRows.length;k++) {
						if(responseRows[k].length==0) continue;
						var tempCols = responseRows[k].split("\t");
						newValue = newValue+tempCols[0]+":"+tempCols[1]+"<br>";
					}
					newValue += "</font>";
					if(frames['chatArea'].document.body.innerHTML!=newValue) {
						frames['chatArea'].document.body.style.margin="0px";
						frames['chatArea'].document.body.style.overflow="scroll";
						frames['chatArea'].document.body.style.whiteSpace="nowrap";
						//frames['chatArea'].style.overflow="scroll";
						frames['chatArea'].document.body.innerHTML = newValue;
					}
					//setTimeout(chatUpdate,3000);
				}
			} else {

			}
		}
	};
	http3.send("");
}

function docLoaded() {
	chatUpdate();
}


document.onkeydown = function (e) {
	if(!e) var e=window.event;
	var code=0;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
	if(!chatBoxInFocus) window.frames['mapFrame'].keyDowned(e);

	return chatBoxInFocus;
}

function pageUnloading() {
	// oh no, leaving the window!
	// hurry, log out!!
	//if(frames['mapFrame'].currPlayer.loggedIn) {
	//	emergencyhttp.open("GET","logout.php",false);
	//	emergencyhttp.send("");
	//	alert("You have been automatically logged out. Please remember to log out before closing the page next time!");
	//}
	return true;
}