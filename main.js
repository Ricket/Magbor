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

var http = getHTTPObject();
var httpMapGet = getHTTPObject();
var httpUsersGet = getHTTPObject();
var httpItemsGet = getHTTPObject();
var httpActions = getHTTPObject();
var httpActions2 = getHTTPObject();
var httpPlayerUpdate = getHTTPObject();

var httpCounter = 0;

function setStyle(element, text) {
    if (window.ActiveXObject) {
        element.style.setAttribute('cssText', text, 0);
    } else {
        element.setAttribute('style', text, 0);
    }
}

function stripSpaces(text) {
    var newText = text;
    while (newText.indexOf(' ') == 0) {
        newText = newText.substring(1);
    }

    while (newText.lastIndexOf(' ') == (newText.length - 1)) {
        newText = newText.substring(0, newText.length - 1);
    }
    return newText;
}

function replaceAll(string, finder, replacer) {
    var newstr = string;
    while (newstr.indexOf(finder) != -1) {
        newstr = newstr.replace(finder, replacer);
    }
    return newstr;
}

function getElementsByClass(searchClass, node, tag) {
    var classElements = new Array();
    if (node == null) node = document;
    if (tag == null) tag = '*';
    var els = node.getElementsByTagName(tag);
    var elsLen = els.length;
    var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
    for (i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            classElements[j] = els[i];
            j++;
        }
    }
    return classElements;
}
