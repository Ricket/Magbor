<?php
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Pragma: no-cache" );

require_once("session_mysql.php");
session_start();
//require_once("mysql.inc.php");

###########################
# KILL IDLERS             #
###########################
$idleRes = @mysql_query("SELECT loggedin FROM users WHERE lastseen<NOW()-INTERVAL 30 SECOND AND loggedin=TRUE") or die("Idle killing failed");
while($idleRow = mysql_fetch_array($idleRes)) {
	@mysql_query("DELETE FROM actions WHERE playerid=".$idleRow['id'].";");
	@mysql_query("INSERT INTO actions VALUES ('',3,".$idleRow["id"].",NOW(),'".$idleRow["map"]."',".$idleRow["xpos"].",".$idleRow["ypos"].",'');");
}
@mysql_query("UPDATE users SET loggedin=FALSE WHERE lastseen<NOW()-INTERVAL 30 SECOND AND loggedin=TRUE;") or die("Idle killing failed");
###########################

$justloggedin = false;
if(!isset($_SESSION["username"])) {

	if(empty($_POST["username"]) || empty($_POST["password"])) {
		die("Empty username or password field.");
	}

	if (!get_magic_quotes_gpc()) {
		$username = addslashes($_POST['username']);
		$password = addslashes($_POST['password']);
	} else {
		$username = $_POST['username'];
		$password = $_POST['password'];
	}
	if(preg_match("/^[a-zA-Z0-9]{3,12}$/",$username)==0) {
		die("Invalid username");
	}
	if(preg_match("/^[a-zA-Z0-9]{4,20}$/",$password)==0) {
		die("Invalid password");
	}
	$query = "SELECT * FROM users WHERE username='".$username."' AND password=MD5('".$password."')";
	$result = mysql_query($query) or die("1\n".mysql_error());
	if(mysql_num_rows($result)<1) {
		die("No such user, or invalid pass.");
	}
	$userInfo = mysql_fetch_array($result);
	if((int)$userInfo['loggedin']==1) {
		die("User is already logged in. If this was you, please wait approximately 30 seconds and then try again. Please make sure to log out before you exit the game!");
	}
	$_SESSION["id"] = $userInfo["id"];
	$_SESSION["username"] = $userInfo["username"];
	$_SESSION["map"] = $userInfo["map"];
	$_SESSION["xpos"] = $userInfo["xpos"];
	$_SESSION["ypos"] = $userInfo["ypos"];
	$_SESSION["playing"] = false;
	$_SESSION["headcolor"] = $userInfo["headcolor"];
	$_SESSION["bodycolor"] = $userInfo["bodycolor"];
	$_SESSION["legscolor"] = $userInfo["legscolor"];
	$_SESSION["outlinecolor"] = $userInfo["outlinecolor"];
	$justloggedin = true;
}
?>
<html>
<head>
<title>Magbor - Logged In</title>
<script language="Javascript">
function openGameWin() {
	window.open("gameWin.html","_blank","width=800, height=500, location=no, directories=no, menubar=no, resizable=no, scrollbars=no, status=yes, toolbar=no");
}
</script>
</head>
<body>
<p align="center">
<?php
if($justloggedin==true) echo 'You are now logged in.<br>';
?>
<a href="javascript:void(0);" onclick="javascript:openGameWin()">Play game</a> (you may have to disable pop-up blockers)</p>
<p align="center"><a href="changelook.php">Change your character's look</a></p>
<p align="center"><a href="logout.php">Log out</a></p>
</body>
</html>
<?php

$result2 = @mysql_query("SELECT id FROM actions WHERE playerid!=".$_SESSION["id"]." ORDER BY time DESC") or die("MySQL error");
if(mysql_num_rows($result2)==0) $_SESSION["lastupdate"] = -1;
$row2 = mysql_fetch_array($result2);
$_SESSION["lastupdate"] = $row2['id'];
@mysql_free_result($result);
?>