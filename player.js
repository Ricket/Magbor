//player.js
//holds the player class

function Player() {
    this.id = -1;
    this.arrayPos = -1;
    this.username = null; // string of username
    this.loggedIn = false;
    this.inventory = new Array(); // array of Items
    this.inventorySize = 0;
    this.updated = true;
    this.posX = 0;
    this.posY = 0;
    this.startX = 0;
    this.startY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.startTime = 0;
    this.targetTime = 0;
    this.busy = false;
    this.reqWalkX = -1;
    this.reqWalkY = -1;
    this.image = null; // image element
    this.preloadedImages = new Array();
    this.preloadedImageCount = 0;

    Player.prototype.LoadImage = function (imageSrc) {
        if (typeof(imageSrc) == "string") {
            this.image = new Image(32, 32);
            this.image.style.display = "none";
            this.image.style.zIndex = "2";
            this.image.src = imageSrc;
            document.body.appendChild(this.image);
        } else {
            this.image = imageSrc;
        }
        var tempBlah = this;
        this.image.onmouseover = function () {
            tempBlah.ShowNameTag();
        };
        this.image.onmouseout = function () {
            tempBlah.HideNameTag();
        };
    }

    Player.prototype.ShowNameTag = function () {
        playerName.style.top = parseInt(this.image.style.top) - 20;
        playerName.style.left = parseInt(this.image.style.left) - 17;
        if (parseInt(playerName.style.top) < 0) playerName.style.top = "0";
        if (parseInt(playerName.style.left) < 0) playerName.style.left = "0";
        if (parseInt(playerName.style.left) + parseInt(playerName.style.width) > mapWidth * 32) playerName.style.left = (mapWidth - parseInt(playerName.style.width)) + "px";

        playerName.innerHTML = '<center><font face="Courier New" size="-2">' + this.username + '</font></center>';
        playerName.style.display = "inline";
    }

    Player.prototype.HideNameTag = function () {
        playerName.style.display = "none";
        playerName.innerHTML = '&nbsp;';
        //playerName.removeChild(playerName.childNodes[0]);
    }


    Player.prototype.PreloadImage = function (imageSrc) {
        if (typeof(imageSrc) == "string") {
            this.preloadedImages[preloadedImageCount] = new Image(32, 32);
            this.preloadedImages[preloadedImageCount].style.display = "none";
            this.preloadedImages[preloadedImageCount].zIndex = "2";
            this.preloadedImages[preloadedImageCount].src = imageSrc;
            document.body.appendChild(this.preloadedImages[preloadedImageCount]);
            preloadedImageCount = preloadedImageCount + 1;
        } else {
            this.preloadedImages[preloadedImageCount] = imageSrc;
            preloadedImageCount = preloadedImageCount + 1;
        }
    }

    Player.prototype.WalkBy = function (xOffset, yOffset) {
        // walk (xOffset,yOffset) number of spaces, via some setTimeouts.
        this.busy = true;
        this.startTime = (new Date()).getTime();
        this.targetTime = this.startTime + 1000;
        this.startX = this.posX;
        this.startY = this.posY;
        this.targetX = this.posX + xOffset;
        this.targetY = this.posY + yOffset;
        var tmp = this;
        setTimeout(function () {
            tmp.UpdateMove();
        }, 100);
    }

    Player.prototype.UpdateMove = function () {
        var currTime = (new Date()).getTime();
        if (currTime > this.targetTime) {
            this.posX = this.targetX;
            this.posY = this.targetY;
            this.UpdateImage();
            this.busy = false;
            return;
        }
        var a = (currTime - this.startTime) / (this.targetTime - this.startTime);
        this.posX = this.startX + a * (this.targetX - this.startX);
        this.posY = this.startY + a * (this.targetY - this.startY);

        if (this.posX != this.targetX || this.posY != this.targetY) {
            this.UpdateImage();
            var tmp = this;
            setTimeout(function () {
                tmp.UpdateMove();
            }, 100);
        } else {
            this.UpdateImage();
            this.busy = false;
        }
    }

    Player.prototype.UpdateImage = function () {
        if (this.image == null) return;
        if (this.image.style.display != "inline") this.image.style.display = "inline";
        if (this.image.style.position != "absolute") this.image.style.position = "absolute";
        this.image.style.left = parseInt(this.posX * 32);
        this.image.style.top = parseInt(this.posY * 32);
        mapCenter(currPlayer.posX, currPlayer.posY);
        // is this all?
    }

    Player.prototype.SetPosition = function (newx, newy) {
        this.posX = newx;
        this.posY = newy;
        this.UpdateImage();
    }

    Player.prototype.Remove = function () {
        this.busy = true;
        if (this.image) document.body.removeChild(this.image);
        this.loggedIn = false;
        this.id = -1;
        this.username = null
        players.splice(this.arrayPos, 1);
        nearbyPlayers--;
    }

    Player.prototype.AddItem = function (itemid, typeid) {
        top.printfire("AddItem: " + itemid + "," + typeid);
        if (this.inventorySize == 30) {
            alert("Inventory size hit 30 and trying to add another item.");
            return;
        }
        if (getItemFromCurrPlayer(itemid) != null) return;
        var tempItem = new Item;
        tempItem.id = itemid;
        tempItem.type = typeid;
        tempItem.owner = this;
        tempItem.ownerType = "player";
        tempItem.UpdateInInventory();
        RecalculateInventory();
    }
}

var currPlayer = new Player;

var playerName = document.createElement("div");
playerName.style.zIndex = "4";
playerName.style.display = "none";
playerName.style.position = "absolute";
playerName.style.width = 74; // 32 + (21*2)
playerName.style.backgroundColor = "#ffffff";

var mapNumber = -1;
var players = new Array();
var nearbyPlayers = 0;

function getPlayerById(idnum) {
    for (var i = 0; i < nearbyPlayers; i++) {
        if (players[i].id == idnum) return players[i];
    }
    return null;
}

function getItemFromCurrPlayer(idnum) {
    top.printfire("getItemFromCurrPlayer(" + idnum + ")");
    top.printfire("inventorySize:" + currPlayer.inventorySize);
    top.printfire("inventory length" + currPlayer.inventory.length);
    top.printfire(currPlayer.inventory);
    for (var i = 0; i < currPlayer.inventorySize; i++) {
        if (currPlayer.inventory[i].id == idnum) return currPlayer.inventory[i];
    }
    return null;
}

function RecalculateInventory() {
    var innersrc = "<center><b><u>Inventory</u></b></center><br>";
    if (currPlayer.inventorySize == 0) {
        innersrc += "<font size=\"-1\">No items!</font>";
    } else {
        for (var i = 0; i < currPlayer.inventorySize; i++) {
            innersrc += "<img src=\"./images/items/" + currPlayer.inventory[i].type + "_inventory.gif\" onclick=\"frames['mapFrame'].DropItem('" + currPlayer.inventory[i].id + "')\" style=\"cursor:pointer;\" />";
            if ((i + 1) % 7 == 0) innersrc += "<br>";
        }
    }
    innersrc += "<p align=\"center\"><a href=\"logout.php\" target=\"mapFrame\">Logout</a></p>";
    top.document.getElementById("inventoryDiv").innerHTML = innersrc;
}

var itemhttpbusy = false;
var itemhttpidcopy = -1;

function DropItem(itemid) {
    itemhttp.open("GET", "action.php?id=6&itemid=" + itemid, true);
    try {
        itemhttp.onreadystatechange = null;
    } catch (e) {}
    if (itemhttpbusy) setTimeout("DropItem(" + itemid + ")", 500);
    itemhttpbusy = true;
    itemhttpidcopy = parseInt(itemid);
    itemhttp.onreadystatechange = function () {
        if (itemhttp.readyState == 4) {
            if (itemhttp.status == 200) {
                if (itemhttp.responseText == "0") {
                    //failure
                    top.printfire("error dropping item:\n" + itemhttp.responseText);
                } else if (itemhttp.responseText == "1") {
                    getItemFromCurrPlayer(itemhttpidcopy).Drop();
                } else {
                    alert("Unknown drop response:\n" + itemhttp.responseText);
                }
                RecalculateInventory();
            } else {
                // alert("Error in drop");
            }
            itemhttpbusy = false;
            itemhttpidcopy = -1;
        }
    };
    itemhttp.send("");
}
