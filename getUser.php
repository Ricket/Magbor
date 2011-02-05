<?php
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Pragma: no-cache" );
// gets basic info about another player, or the current player
// info returned is based on a get variable
//  1) non-logged in users should not see logged-in ones
//  2) if logged-in user is not on same map, then this returns error

require_once("session_mysql.php");
session_start();
//require_once("mysql.inc.php");

if($_SESSION['playing']==false) {
	@mysql_query("UPDATE users SET loggedin=TRUE WHERE username='".$_SESSION["username"]."'");
	@mysql_query("INSERT INTO actions VALUES ('',2,".$_SESSION["id"].",NOW(),'".$_SESSION["map"]."',".$_SESSION["xpos"].",".$_SESSION["ypos"].",'".$_SESSION["username"]."');");
	$_SESSION['playing'] = true;
}

$checkloggedin = @mysql_query("SELECT loggedin FROM users WHERE id=".$_SESSION['id'].";") or die("false");
if(mysql_num_rows($checkloggedin)!=1) {
	unset($_SESSION["username"]);
	die("false"); // not logged in anymore
} else {
	$checkRow = mysql_fetch_array($checkloggedin);
	if((int)$checkRow['loggedin']!=1) {
		unset($_SESSION["username"]);
		die("false");
	} // else, logged in
}

if(!isset($_SESSION["username"])) {
	die("false");
} else {
	@mysql_query("UPDATE users SET lastseen=NOW() WHERE username='".$_SESSION["username"]."'") or die("false");
	echo 'true'."\n".$_SESSION["id"]."\n".$_SESSION["username"]."\n".$_SESSION["map"]."\n".$_SESSION["xpos"]."\n".$_SESSION["ypos"];
}
?>