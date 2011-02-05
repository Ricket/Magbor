<?php
// These headers might solve caching problems, but they also increase
// bandwidth by quite a lot
// Uncomment only if major problems occur that are unfixable by other methods
// header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
// header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
// header( "Cache-Control: no-cache, must-revalidate" );
// header( "Pragma: no-cache" );
// action.php
// performs an action
require_once("session_mysql.php");
session_start();

if(!isset($_SESSION["username"])) {
	die("2");
}

if(!isset($_GET["id"]) || strlen($_GET["id"])<1) die("0\nParameter error");

if (!get_magic_quotes_gpc()) {
	$actionparams = addslashes($_GET["params"]);
} else {
	$actionparams = $_GET["params"];
}


if(!is_int($_GET["id"]+0)) die("0\nParameter error");
$actionid = (int)$_GET["id"];
// check for valid action id here (make sure its not greater than the
// largest action number)
if($actionid < 0 || $actionid > 6) die("0\nParameter error");

//require_once("mysql.inc.php");

###########################
# KILL IDLERS             #
###########################
$idleRes = @mysql_query("SELECT loggedin FROM users WHERE lastseen<NOW()-INTERVAL 30 SECOND AND loggedin=TRUE") or die("Idle killing failed");
while($idleRow = mysql_fetch_array($idleRes)) {
	@mysql_query("DELETE FROM actions WHERE playerid=".$idleRow['id'].";");
	@mysql_query("INSERT INTO actions VALUES ('',3,".$idleRow['id'].",NOW(),".$idleRow['map'].",".$idleRow["xpos"].",".$idleRow["ypos"].",'');");
}
@mysql_query("UPDATE users SET loggedin=FALSE WHERE lastseen<NOW()-INTERVAL 30 SECOND AND loggedin=TRUE;") or die("Idle killing failed");
###########################

$checkloggedin = @mysql_query("SELECT loggedin FROM users WHERE id=".$_SESSION['id'].";") or die("0\nMySQL error");
if(mysql_num_rows($checkloggedin)!=1) {
	unset($_SESSION["username"]);
	die("2"); // not logged in anymore
} else {
	$checkRow = mysql_fetch_array($checkloggedin);
	if((int)$checkRow['loggedin']!=1) {
		unset($_SESSION["username"]);
		die("2");
	} // else, logged in
}
mysql_query("UPDATE users SET lastseen=NOW() WHERE id=".$_SESSION["id"]);

//////////////////////////////////////////////////////////

// 1 - Walk
// [get] id, x, y
// x and y are -1 to 1
if($actionid == 1) {
	if(!isset($_GET["x"]) || !is_int($_GET["x"]+0)) die("0");
	if(!isset($_GET["y"]) || !is_int($_GET["y"]+0)) die("0");
	$walkx = (int)$_GET["x"];
	$walky = (int)$_GET["y"];
	if($walkx>1) die("0");
	if($walkx<-1) die("0");
	if($walky>1) die("0");
	if($walky<-1) die("0");
	if($_SESSION["map"]==0) {
		if((((int)$_SESSION["xpos"])+$walkx)>24 || (((int)$_SESSION["ypos"])+$walky)>24) die("0\nCheater! (or map error)");
	}
	@mysql_query("DELETE FROM actions WHERE time>NOW();") or die();
	@mysql_query("UPDATE users SET xpos=".(((int)$_SESSION["xpos"])+$walkx).", ypos=".(((int)$_SESSION["ypos"])+$walky)." WHERE id=".$_SESSION["id"].";") or die("0\nMySQL error:1");
	$_SESSION["xpos"] = ((int)$_SESSION["xpos"])+$walkx;
	$_SESSION["ypos"] = ((int)$_SESSION["ypos"])+$walky;
	@mysql_query("INSERT INTO actions VALUES ('','1','".$_SESSION["id"]."',NOW(),".$_SESSION["map"].",'".$_SESSION["xpos"]."','".$_SESSION["ypos"]."','');") or die("0\nMySQL error:1");
	echo("1");
	exit();
}
// 2 - Log in
// all vars are in session
else if($actionid == 2) {
	// do nothing, this should be handled by login.php!
}
// 3 - Log out
// all vars are in session
else if($actionid == 3) {
	// do nothing, this should be handled by logout.php!
}

// 4 - Chat message
else if($actionid == 4) {
	if(empty($_GET["msg"])) die("0");

	if (!get_magic_quotes_gpc()) {
		$message = addslashes($_GET['msg']);
	} else {
		$message = $_GET['msg'];
	}
	$result = @mysql_query("INSERT INTO public_chat VALUES ('','".$_SESSION["username"]."',NOW(),'".$_SESSION["map"]."','".$message."');");
	if(!$result){
		if(stristr(mysql_error(),'duplicate')) {
			@mysql_query("ALTER TABLE public_chat AUTO_INCREMENT=0;") or die("0\nMySQL error:reset autoincrement");
			@mysql_query("INSERT INTO public_chat VALUES ('','".$_SESSION["username"]."',NOW(),'".$_SESSION["map"]."','".$message."');") or die("MySQL error:4");
			
		} else {
			die("0");
		}
	} else {
		@mysql_query("INSERT INTO actions VALUES ('',4,".$_SESSION["id"].",NOW(),".$_SESSION["map"].",".$_SESSION["xpos"].",".$_SESSION["ypos"].",'');");
	}
}

// 5 - Pickup Item
else if($actionid == 5) {
	if(!isset($_GET['itemid'])) die("0");
	$itemid = (int)($_GET['itemid']);

	$result = mysql_query("SELECT id FROM items WHERE playerid=".$_SESSION['id'].";") or die("0");
	if(mysql_num_rows($result)>=30) {
		// player already has 30 items
		// (shouldn't be > 30)
		die("0");
	}
	mysql_free_result($result);

	$result = mysql_query("SELECT * FROM items WHERE id=".$itemid.";") or die("0");
	if(mysql_num_rows($result)==0) {
		die("0");
	}
	$itemrow = mysql_fetch_array($result);
	if($itemrow['playerid']!=0 || $itemrow['map']!=$_SESSION['map'] || $itemrow['xpos']!=$_SESSION['xpos'] || $itemrow['ypos']!=$_SESSION['ypos']) {
		die("0");
	} else {
		@mysql_query("UPDATE items SET playerid=".$_SESSION['id'].",map=0,xpos=0,ypos=0 WHERE id=".$itemid.";") or die("0");
		mysql_query("INSERT INTO actions VALUES ('',5,".$_SESSION['id'].",NOW(),".$_SESSION['map'].",".$_SESSION['xpos'].",".$_SESSION['ypos'].",'".$itemid."');");
		echo '1';
	}
}

// 6 - Drop Item
else if($actionid == 6) {
	if(!isset($_GET['itemid'])) die("0");
	$itemid = (int)($_GET['itemid']);


	$result = mysql_query("SELECT typeid FROM items WHERE id=".$itemid." AND playerid=".$_SESSION['id'].";") or die("0");
	if(mysql_num_rows($result)!=1) {
		die("0");
	}
	$itemrow = mysql_fetch_array($result);


	@mysql_query("UPDATE items SET playerid=0,map=".$_SESSION['map'].",xpos=".$_SESSION['xpos'].",ypos=".$_SESSION['ypos']." WHERE id=".$itemid.";") or die("0");
	mysql_query("INSERT INTO actions VALUES ('',6,".$_SESSION['id'].",NOW(),".$_SESSION['map'].",".$_SESSION['xpos'].",".$_SESSION['ypos'].",'".$itemid."|".$itemrow['typeid']."');");
	echo '1';
}
?>