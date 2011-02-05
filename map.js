// add detector to make sure it's an iframe
window.onload = function () {
	if(window==top || top.location.href.indexOf("gameWin.html")==-1) {
		alert("No cheating!");
		document.write("Access denied");
		return;
	}
	
	// little extra init from the home of "player" hehe
	document.body.appendChild(playerName);

	// query getUser.php, see if it returns false
	http.open("GET","getUser.php?blah="+httpCounter,true);
	httpCounter++;
	try {
		http.onreadystatechange = null;
	} catch(e) {
	
	}
	http.onreadystatechange = function () {
		if (http.readyState == 4) {
			if (http.status == 200) {
				window.status = "";
				checkLoggedIn(http.responseText);
			} else {
				window.status = "";
				alert('There was a problem retrieving the login page:' + "\n" + http.statusText + "\nTry to log in again.");
			}
		} else {
			window.status = "Loading...";
		}
	};
	http.send("");
	window.status="Loading...";
}

document.onkeydown = keyDowned;

function keyDowned(e) {
	if(!e) var e=window.event;
	var retVal = true;
	var code;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
	// left 37, up 38, right 39, down 40
	if(code==37) {
		// left arrow
		//window.scrollBy(-50,0);
		if(!currPlayer.busy && currPlayer.posX>0) {
			playerWalk(-1,0);
		}
		retVal = false;
	} else if(code==38) {
		// up arrow
		//window.scrollBy(0,-50);
		if(!currPlayer.busy && currPlayer.posY>0) {
			playerWalk(0,-1);
		}
		retVal = false;
	} else if(code==39) {
		// right arrow
		//window.scrollBy(50,0);
		if(!currPlayer.busy && currPlayer.posX<(mapWidth-1)) {
			playerWalk(1,0);
		}
		retVal = false;
	} else if(code==40) {
		// down arrow
		//window.scrollBy(0,50);
		if(!currPlayer.busy && currPlayer.posY<(mapHeight-1)) {
			playerWalk(0,1);
		}
		retVal = false;
	}
	//var character = String.fromCharCode(code);
	//top.printfire("Pressed "+code+" which is character "+character);
	e.cancelBubble=true;
	if(e.stopPropagation) e.stopPropagation();
	return retVal;
}

function playerWalk(x,y) {
	try {
		httpActions.open("GET","action.php?blah="+httpCounter+"&id=1&x="+x+"&y="+y,true);
		httpCounter++;
		try {
			httpActions.onreadystatechange = null;
		} catch(e) {
		}
		httpActions.onreadystatechange = function () {
			if(httpActions.readyState == 4) {
				if(httpActions.status == 200) {
					if(httpActions.responseText=="1") {
						currPlayer.WalkBy(currPlayer.reqWalkX, currPlayer.reqWalkY);
					} else if(httpActions.responseText=="2") {
						currPlayer.loggedIn = false;
						alert("You are no longer logged in.");
						makeLoginForm();
					} else {
						alert("Walk error:\n"+httpActions.responseText);
						currPlayer.busy = false;
					}
				} else {
					currPlayer.busy = false;
				}
			}
		};
		httpActions.send("");
		currPlayer.busy = true;
		currPlayer.reqWalkX = x;
		currPlayer.reqWalkY = y;
	} catch(e) {
		setTimeout("playerWalk("+x+","+y+")",250);
	}
}

function checkLoggedIn(result) {
	if(result=="false") {
		currPlayer.loggedIn = false;
		makeLoginForm();
	} else if(result.startsWith("true")) {
		currPlayer.loggedIn = true;
		currPlayer.id = result.split("\n")[1];
		currPlayer.username = result.split("\n")[2];
		mapNumber = parseInt(result.split("\n")[3]);
		currPlayer.posX = parseInt(result.split("\n")[4]);
		currPlayer.posY = parseInt(result.split("\n")[5]);
		currPlayer.LoadImage("./characterimage.php?id="+currPlayer.id);
		currPlayer.UpdateImage();
		changeMap(mapNumber);
	} else {
		alert("Unknown response from getUser.php:\n"+result);
	}
}

function makeLoginForm() { // displays error: not logged in
	var bodyTag = document.getElementsByTagName("body")[0];
	bodyTag.innerHTML = '<font color="red">You are not logged in!</font><br>Close this window and log in before trying to play again.';
}

function changeMap(id) {
	var imgs = getElementsByClass("tile",document.body,"img");
	for(var i=0;i<imgs.length;i++) {
		document.body.removeChild(imgs[i]);
	}
	httpMapGet.open("GET","getMap.php?num="+id,true);
	try {
		httpMapGet.onreadystatechange = null;
	} catch(e) {
	}
	httpMapGet.onreadystatechange = function () {
		if(httpMapGet.readyState == 4) {
			window.status = '';
			if(httpMapGet.status == 200) {
				if(httpMapGet.responseText!="0") {
					drawMap(httpMapGet.responseText);
				} else {
					alert("Error during map loading.");
				}
			} else {
				alert("There was a problem while loading the map. Please refresh and re-login.\nresponseText:"+http.responseText);
			}
		}
	};
	httpMapGet.send("");
	window.status="Loading..."
}

function drawMap(text) {
	var mode = null;
	mapFilename = null;
	var descHTML = '<center>';
	//top.document.getElementById('toprightdiv').innerHTML = '';
	var lineNum = 0;
	while(lineNum<text.split("\n").length) {
		var line = text.split("\n")[lineNum];
		// check if it's a mode line
		if(line.startsWith('[',true)) {
			mode = line.substring(1,line.length-2);
			lineNum++;
			continue;
		}
		if(mode == "Properties") {
			if(line.startsWith('name=',false)) {
				mapName = line.substring(5,line.length);
				descHTML += "<b>"+mapName+"</b><br>";
			} else if(line.startsWith('description=',false)) {
				mapDescription = line.substring(12,line.length);
				descHTML += mapDescription+"<br>";
			} else if(line.startsWith('filename=',false)) {
				mapFilename = line.substring(9,line.length);
			} else if(line.startsWith('width=',false)) {
				mapWidth = line.substring(6,line.length);
			} else if(line.startsWith('height=',false)) {
				mapHeight = line.substring(7,line.length);
			}
		} else if(mode == "Layout") {
			break;
		}
		lineNum++;
	}
	descHTML += "<br><a href=\"javascript:void(frames['mapFrame'].logOut())\" target=\"_top\">Log out</a></center>";
	// top.document.getElementById("toprightdiv").innerHTML = descHTML;
	if(mode != "Layout") return; // we're done, there's nothing to draw
	if(mapFilename == null) return; // we can't do any pictures without a filename!
	//top.document.getElementById('toprightdiv').style.height=null;
	var firstLine = lineNum;
	while(lineNum<text.split("\n").length) {
		var line=text.split("\n")[lineNum];
		for(var i=0;i<line.split("|").length;i++) {
			imgFile = "./maps/"+mapFilename+"/"+line.split("|")[i]+".gif";
			tempImg = new Image(32,32);
			tempImg.src = imgFile;
			tempImg.id = "tile_"+i+"_"+(lineNum-firstLine);
			tempImg.className = "tile";
			document.body.appendChild(tempImg);
			//document.getElementById("tile_"+i+"_"+(lineNum-firstLine)).onclick=tileClick;
		}
		document.body.appendChild(document.createElement("br"));
		lineNum++;
	}
	mapCenter(currPlayer.posX,currPlayer.posY);

	httpUsersGet.open("GET","getUsersInArea.php?blah="+httpCounter,true);
	httpCounter++;
	try {
		httpUsersGet.onreadystatechange = null;
	} catch(e) {
	}
	httpUsersGet.onreadystatechange = checkUsersInAreaResponse;
	httpUsersGet.send("");
}

function checkUsersInAreaResponse() {
	if(httpUsersGet.readyState == 4) {
		window.status = '';
		if(httpUsersGet.status == 200 && httpUsersGet.responseText!="0" && httpUsersGet.responseText!="-1") {
			drawPlayers(httpUsersGet.responseText);
			//updateActions();
			getItemsInArea();
		} else if(httpUsersGet.status != 200) {
			alert("There was a problem querying for the users on the map. Please close and re-open the game.");
		} else if(httpUsersGet.responseText == "-1") {
			alert("There was a problem while loading the players on the map. Please refresh and re-login.");
		} else if(httpUsersGet.responseText == "0") {
			// no players nearby
			getItemsInArea();
			//updateActions();
		} else {
			alert("There was a problem while loading the players on the map. Please refresh and re-login.\nDebug info:"+http.responseText);
		}
	}
}

function getItemsInArea() {
	httpItemsGet.open("GET","getItemsInArea.php?blah="+httpCounter,true);
	httpCounter++;
	try {
		httpItemsGet.onreadystatechange = null;
	} catch(e) {
	}
	httpItemsGet.onreadystatechange = checkItemsInAreaResponse;
	httpItemsGet.send("");
}

function checkItemsInAreaResponse() {
	if(httpItemsGet.readyState == 4) {
		if(httpItemsGet.status == 200) {
			if(httpItemsGet.responseText == "0") {
				// no items in area
				RecalculateInventory();
				updateActions();
			} else if(httpItemsGet.responseText.startsWith("-1")) {
				alert("There was a problem while loading the items on the map. Please refresh and re-login.\nDebug info:"+http.responseText);
			} else {
				drawItems(httpItemsGet.responseText);
				updateActions();
			}
		} else {
			alert("There was a problem while loading the items on the map. Please refresh and re-login.\nDebug info:"+http.responseText);
		}
	}
}

function logOut() {
	if(currPlayer.loggedIn) {
		currPlayer.loggedIn = false;
		http.open("GET","logout.php",true);
		try {
			http.onreadystatechange = null;
		} catch(e) {
		}
		http.onreadystatechange = function () {
			if(http.readyState == 4) {
				if(http.status == 200) {
					document.body.innerHTML = http.responseText;
				}
			}
		};
		http.send("");
		document.body.innerHTML = "Logging out, please wait...";
	}
}

function drawPlayers(dump) {
	top.printfire("drawPlayers");
	var rows = dump.split("\n");
	for(var i=0;i<rows.length;i++) {
		if(rows[i].length==0) continue;
		var cols = rows[i].split("\t");
		if(cols.length != 4) continue;

		var tempNP = nearbyPlayers;
		nearbyPlayers++;
		players[tempNP] = new Player;
		players[tempNP].id = parseInt(cols[0]);
		players[tempNP].arrayPos = tempNP;
		players[tempNP].username = cols[1];
		players[tempNP].posX = parseInt(cols[2]);
		players[tempNP].startX = parseInt(cols[2]);
		players[tempNP].targetX = parseInt(cols[2]);
		players[tempNP].posY = parseInt(cols[3]);
		players[tempNP].startY = parseInt(cols[3]);
		players[tempNP].targetY = parseInt(cols[3]);
		players[tempNP].LoadImage("./characterimage.php?id="+players[tempNP].id);
		players[tempNP].UpdateImage();
	}
	// now all drawing is done, we start grabbing actions :)
}

function drawItems(dump) {
	var rows = dump.split("\n");
	for(var i=0;i<rows.length;i++) {
		if(rows[i].length==0) continue;
		var cols = rows[i].split("\t");
		if(cols.length == 4) {
			var tempNI = nearbyItems;
			nearbyItems++;
			items[tempNI] = new Item;
			items[tempNI].id = parseInt(cols[0]);
			items[tempNI].arrayPos = tempNI;
			items[tempNI].type = parseInt(cols[1]);
			items[tempNI].posX = parseInt(cols[2]);
			items[tempNI].posY = parseInt(cols[3]);
			items[tempNI].ownerType = "ground";
			items[tempNI].UpdateOnMap();
		} else if(cols.length == 2) {
			currPlayer.AddItem(parseInt(cols[0]),parseInt(cols[1]));
		} else {
			continue;
		}
	}
	RecalculateInventory();
}

function mapCenter(x,y) {
	var centerTile = document.getElementById("tile_"+Math.floor(x)+"_"+Math.floor(y));
	if(!centerTile) return;
	var remainderX = (x - Math.floor(x))*32;
	var remainderY = (y - Math.floor(y))*32;
	if(window.innerWidth && window.innerHeight) {
		var sX = (centerTile.offsetLeft - parseInt(window.innerWidth/2))+remainderX+15;
		var sY = (centerTile.offsetTop - parseInt(window.innerHeight/2))+remainderY+15;
	} else {
		var sX = (centerTile.offsetLeft - parseInt(document.body.clientWidth/2))+remainderX+15;
		var sY = (centerTile.offsetTop - parseInt(document.body.clientHeight/2))+remainderY+15;
	}
	window.scrollTo(sX,sY);
}

var mapFilename = null;
var mapWidth = -1;
var mapHeight = -1;
var mapName = null;
var mapDescription = null;
var errorsInARow = 0;
var updatesSincePlayerCheck = 0;

function updateActions() {
	if(!currPlayer.loggedIn) {
		setTimeout(updateActions,1000);
		return;
	}
	try {
		httpActions2.open("GET","update.php?blah="+httpCounter,true);
		httpCounter++;
		try {
			httpActions2.onreadystatechange = null;
		} catch(e) {
		}
		httpActions2.onreadystatechange = function () {
			if(httpActions2.readyState == 4) {
				if(httpActions2.status == 200) {
					////////////////////////////////////////////////////
					if(httpActions2.responseText.indexOf("Not logged in")!=-1) {
						currPlayer.loggedIn = false;
						makeLoginForm();
					} else if(httpActions2.responseText.indexOf("MySQL error")!=-1) {
						//top.printfire("MYSQL ERROR IN UPDATEACTIONS!");
					} else if(httpActions2.responseText.indexOf("No rows")!=-1) {
						// no rows, do nothing...
						//top.printfire("updateActions: no rows");
					} else if(httpActions2.responseText == "") {
						// nothing...?
						//top.printfire("nothing...?");
					} else {

						// it's good! or so it seems
						var rows = httpActions2.responseText.split("\n");
						for(var i=0;i<rows.length;i++) {
							var cols = rows[i].split("\t");
							if(parseInt(cols[0])==1) { //walk
								//top.printfire("Walk action detected");
								var thePlayer = getPlayerById(parseInt(cols[1]));
								if(thePlayer==null) {
									//alert("An error has occurred, you are being automatically reloaded...");
									changeMap(mapNumber); // reload
								} else {
									thePlayer.WalkBy((parseInt(cols[3])-thePlayer.posX),(parseInt(cols[4])-thePlayer.posY));
								}

							} else if(parseInt(cols[0])==2) { // log in
								//top.printfire("Log in action detected");
								if(getPlayerById(parseInt(cols[1]))==null) {
									var tempNP = nearbyPlayers;
									nearbyPlayers++; // this section is to make it thread-safe :)
									players[tempNP] = new Player;
									players[tempNP].id = parseInt(cols[1]);
									players[tempNP].arrayPos = tempNP;
									players[tempNP].username = cols[5];
									players[tempNP].posX = parseInt(cols[3]);
									players[tempNP].startX = parseInt(cols[3]);
									players[tempNP].targetX = parseInt(cols[3]);
									players[tempNP].posY = parseInt(cols[4]);
									players[tempNP].startY = parseInt(cols[4]);
									players[tempNP].targetY = parseInt(cols[4]);
									players[tempNP].LoadImage("./characterimage.php?id="+players[tempNP].id);
									players[tempNP].UpdateImage();

								} else {
									//top.printfire("duplicate player login");
								}
							} else if(parseInt(cols[0])==3) { // log out
								//top.printfire("Log out action detected");
								var thePlayer = getPlayerById(parseInt(cols[1]));
								if(thePlayer!=null) {
									thePlayer.Remove();
								} else {
									//top.printfire("nonexistant player logout");
								}
							} else if(parseInt(cols[0])==4) { // chat has updated
								top.chatUpdate();
							} else if(parseInt(cols[0])==5) {
								// item has been picked up
								var theItem = getItemById(parseInt(cols[5]));
								if(theItem!=null) {
									theItem.RemoveFromMap();
								}
							} else if(parseInt(cols[0])==6) {
								// item has been dropped
								//cols[5] is string of item id
								var tempNI = nearbyItems;
								nearbyItems++;
								items[tempNI] = new Item;
								items[tempNI].id = parseInt((cols[5]).split("|")[0]);
								items[tempNI].arrayPos = tempNI;
								items[tempNI].type = parseInt((cols[5]).split("|")[1]);
								items[tempNI].posX = parseInt(cols[3]);
								items[tempNI].posY = parseInt(cols[4]);
								items[tempNI].UpdateOnMap();
							} else {
								// unknown action id
								//top.printfire("unknown action id: "+cols[0]);
							}
						} // for(var i=0;i<rows.length;i++)
					}

					////////////////////////////////////////////////////
				} else {
					//top.printfire("another error");
					errorsInARow++;
					if(errorsInARow==5) {
						alert("You seem to have been disconnected. Please refresh this page and re-login.");
					}
				}
				//updatesSincePlayerCheck++;
				//if(updatesSincePlayerCheck > 20) {
				//	setTimeout(updatePlayersOnMap,1);
				//	updatesSincePlayerCheck = 0;
				//}
				setTimeout(updateActions,1000); //700
			}
		};
		httpActions2.send("");
	} catch(e) {
		//top.printfire("updateActions error: "+e);
		//setTimeout(updateActions,2000); //700
	}
}