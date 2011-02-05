// item.js
// holds the item class

function Item() {
    this.id = -1;
    this.arrayPos = -1;
    this.type = -1;
    this.posX = -1; // locations on ground, -1 = not on ground
    this.posY = -1;
    this.owner = null; // variable, Player or null (ground)
    this.ownerType = null; // string, can be "player" "shop" "ground"
    // currently unused though.
    this.image = null;
    this.imageIsOn = null;

    Item.prototype.UpdateOnMap = function () {
        if (this.imageIsOn != "m") {
            this.AddToMap();
        }
        this.UpdateImageLocation();
    }

    Item.prototype.UpdateInInventory = function () {
        if (this.imageIsOn != "i") {
            this.AddToInventory();
        }
        this.UpdateImageLocation();
    }

    Item.prototype.MakeImage = function () {
        if (this.image == null) {
            this.image = new Image(32, 32);
            this.image.id = "itemimg_" + this.id;
            this.image.src = "./images/items/" + this.type + "_ground.gif";
            this.image.style.zIndex = 3;
            this.image.style.cursor = "pointer";
            var tempBlah = this;
            this.image.onclick = function () {
                tempBlah.PickUp();
            };
            this.image.style.display = "inline";
            this.image.style.position = "absolute";
        }
        this.UpdateImageLocation();
    }

    Item.prototype.UpdateImageLocation = function () {
        if (this.image) {
            this.image.style.left = parseInt(this.posX * 32);
            this.image.style.top = parseInt(this.posY * 32);
        }
    }

    Item.prototype.AddToMap = function () {
        this.RemoveFromInventory();
        if (document.getElementById("itemimg_" + this.id) == null) {
            this.MakeImage();
            document.body.appendChild(this.image);
        }
        if (getItemById(this.id) == null) {
            items.push(this);
            this.arrayPos = nearbyItems;
            nearbyItems++;
        }
        this.imageIsOn = "m";
        this.UpdateImageLocation();
    }

    Item.prototype.AddToInventory = function () {
        this.RemoveFromMap();
        if (getItemFromCurrPlayer(this.id) == null) {
            currPlayer.inventory.push(this);
            this.arrayPos = currPlayer.inventorySize;
            currPlayer.inventorySize++;
        }
        RecalculateInventory();
        this.imageIsOn = "i";
        this.UpdateImageLocation();
    }

    Item.prototype.RemoveFromMap = function () {
        this.MakeImage();
        if (document.getElementById("itemimg_" + this.id) != null) document.body.removeChild(this.image);
        if (getItemById(this.id) != null) {
            items.splice(this.arrayPos, 1);
            nearbyItems--;
        }
        this.imageIsOn = null;
        this.UpdateImageLocation();
    }

    Item.prototype.RemoveFromInventory = function () {
        if (getItemFromCurrPlayer(this.id) != null) {
            currPlayer.inventory.splice(this.arrayPos, 1);
            currPlayer.inventorySize--;
        }
        RecalculateInventory();
        this.imageIsOn = null;
        this.UpdateImageLocation();
    }


    Item.prototype.PickUp = function () {
        if ((Math.abs(this.posX - currPlayer.posX) * Math.abs(this.posY - currPlayer.posY)) > 0) {
            //playerWalk(this.posX,this.posY,PickUpItem,this);
        } else {
            itemhttp.open("GET", "action.php?id=5&itemid=" + this.id, true);
            try {
                itemhttp.onreadystatechange = null;
            } catch (e) {}
            var oogabooga = this;
            itemhttp.onreadystatechange = function () {
                if (itemhttp.readyState == 4) {
                    if (itemhttp.status == 200) {
                        if (itemhttp.responseText == "0") {
                            //failure
                        } else if (itemhttp.responseText == "1") {
                            //success
                            oogabooga.UpdateInInventory();
                        } else {
                            alert("Unknown pickup response:\n" + itemhttp.responseText);
                        }
                    } else {
                        // alert("Error in pickup");
                    }
                }
            };
            itemhttp.send("");
        }
    }

    Item.prototype.Drop = function () {
        this.posX = currPlayer.posX;
        this.posY = currPlayer.posY;
        this.UpdateOnMap();
    }
}

var items = new Array();
var nearbyItems = 0;
var itemhttp = getHTTPObject();

function getItemById(idnum) {
    for (var i = 0; i < nearbyItems; i++) {
        if (items[i].id == idnum) return items[i];
    }
    return null;
}

function PickUpItem(theitem) {
    theitem.PickUp();
}
