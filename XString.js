//XPath string functions made available as String class methods
//Loosely translated from a VB version of the XPath string functions by Mark Bosley.
//Fred Baptiste 4/26/01

String.prototype.after = function(parMatch, blnCaseSensitive) {

	var retVal = '';
	var strMatch = String(parMatch);
	
	if (this.length == 0 || strMatch.length==0) 
		return retVal;
	
	blnCaseSensitive = blnCaseSensitive | (String(blnCaseSensitive) == 'undefined'); //default is true

	var lngFind = 0;	
	if (blnCaseSensitive)
		lngFind = this.indexOf(strMatch);
	else 
		lngFind = this.toUpperCase().indexOf(strMatch.toUpperCase());
	
	if (lngFind >= 0) 
		{
			if (lngFind <= (this.length - strMatch.length))
				retVal = this.substr(lngFind + strMatch.length);
		}
	 
	 return retVal;
}


String.prototype.afterRev = function(parMatch, blnCaseSensitive) {

	var retVal = '';
	var strMatch = String(parMatch);
	
	if (this.length == 0 || strMatch.length==0) 
		return retVal;
		
	blnCaseSensitive = blnCaseSensitive | (String(blnCaseSensitive) == 'undefined');

	var lngFind = 0;
	if (blnCaseSensitive)
		lngFind = this.lastIndexOf(strMatch);
	else 
		lngFind = this.toUpperCase().lastIndexOf(strMatch.toUpperCase());
	
	if (lngFind >= 0) 
		{
			if (lngFind <= (this.length - strMatch.length))
				retVal = this.substr(lngFind + strMatch.length);
		}

	 return retVal;
}

String.prototype.before = function(parMatch, blnCaseSensitive) {
	//returns the string to the left of the first (from left) MatchString
	
	var retVal = '';
	var strMatch = String(parMatch);
	
	if (this.length==0 || strMatch.length==0)
		return retVal;
	
	blnCaseSensitive = blnCaseSensitive | (String(blnCaseSensitive) == 'undefined');

	var lngFind=0;
	if (blnCaseSensitive)
		lngFind = this.indexOf(strMatch);
	else
		lngFind = this.toUpperCase().indexOf(strMatch.toUpperCase());
	
	if (lngFind > 0)
		retVal = this.substr(0, lngFind);
	 
	 return retVal
}

String.prototype.beforeRev = function(parMatch, blnCaseSensitive) {
	//returns the string to the left of the first (from left) MatchString
	
	var retVal = '';
	var strMatch = String(parMatch);
	
	if (this.length==0 || strMatch.length==0)
		return retVal;
	
	blnCaseSensitive = blnCaseSensitive | (String(blnCaseSensitive) == 'undefined');

	var lngFind=0;
	if (blnCaseSensitive)
		lngFind = this.lastIndexOf(strMatch);
	else
		lngFind = this.toUpperCase().lastIndexOf(strMatch.toUpperCase());

	if (lngFind > 0)
		retVal = this.substr(0, lngFind);
	 
	 return retVal;
}

String.prototype.contains = function(parMatch, blnCaseSensitive) {

	var retVal = false;
	var strMatch = String(parMatch);
	
	if (strMatch.length == 0)
		return true; //per XPath spec
	
	blnCaseSensitive = blnCaseSensitive | (String(blnCaseSensitive) == 'undefined');
	
	if (blnCaseSensitive) 
		retVal = (this.indexOf(strMatch) > -1);
	else
		retVal = (this.toUpperCase().indexOf(strMatch.toUpperCase()) > -1)

	return retVal;
}

String.prototype.startsWith = function(parMatch, blnCaseSensitive) {

	var retVal = false;
	var strMatch = String(parMatch);

	if (strMatch.length == 0)
		return true; //per XPath spec

	if (strMatch.length > this.length) 
		return false;

	blnCaseSensitive = blnCaseSensitive | (String(blnCaseSensitive) == 'undefined');

	if (blnCaseSensitive) 
		retVal = (this.indexOf(strMatch)==0);
	else
		retVal = (this.toUpperCase().indexOf(strMatch.toUpperCase())==0);

	return retVal;
}


String.prototype.endsWith = function(parMatch, blnCaseSensitive) {

	var retVal = false;
	var strMatch = String(parMatch);
	
	if (strMatch.length == 0)
		return true; //per XPath spec
	
	if (strMatch.length > this.length) 
		return false;
	
	blnCaseSensitive = blnCaseSensitive | (String(blnCaseSensitive) == 'undefined');
	
	if (blnCaseSensitive) {
		var strSlice = this.slice(this.length - strMatch.length);
		retVal = (strSlice == strMatch);
	}
	else {
		var strSlice = this.toUpperCase().slice(this.length - strMatch.length);
		retVal = (strSlice == upMatch);
	}
	
	return retVal;
}	

String.prototype.normalize = function() {
	//Normalize per the XPath spec

	//trim leading and trailing spaces
	strCopy = this.replace(/(^\s+)|(\s+$)/g, '');

	//reduce runs of more than one space to one space only
	strCopy = strCopy.replace(/(\s+)/g, '\x20'); // a space
	
	return strCopy;
}

String.prototype.translate = function(parFrom, parTo, blnCaseSensitive) {
	var strFrom = String(parFrom)
	var strTo = String(parTo)
	var strCopy = '';
	var strBuffer = '';
	var lngPos = 0;
	
	var strEmpty = String.fromCharCode(1) //defines a value for the "empty" char

	//flesh out the translation string if necessary	
	if (strFrom.length > strTo.length) {
		for (var i=1;i<=(strTo.length-strFrom.length);i++)
			strTo = strTo + strEmpty;
	}

	blnCaseSensitive = blnCaseSensitive | (String(blnCaseSensitive) == 'undefined');
	//loop through each character in this
	for (var i=0;i<this.length;i++) 
	{
		strBuffer = this.substr(i,1);
		if (blnCaseSensitive)
			lngPos = strFrom.indexOf(strBuffer);
		else
			lngPos = (strFrom.toUpperCase()).indexOf((strBuffer.toUpperCase()));
			
		if (lngPos>-1)
			strCopy = strCopy + strTo.charAt(lngPos);
		else
			strCopy = strCopy + strBuffer;
	}
	
	//finally remove "empty" characters
	return strCopy.replace(strEmpty, '');
}

//trim method
//not part of XPath functions, but useful nonetheless...
String.prototype.trim = function() {
	    // Use a regular expression to replace leading and trailing 
	    // spaces with the empty string
	    return this.replace(/(^\s*)|(\s*$)/g, "");
}