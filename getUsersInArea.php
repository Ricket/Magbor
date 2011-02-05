<?php
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Pragma: no-cache" );
// getUsersInArea.php
// gets all the users on the logged-in player's map
require_once("session_mysql.php");
session_start();

if(!isset($_SESSION["username"])) {
	exit();
}

if($_SESSION["playing"]==false) $_SESSION["playing"]=true;

//require_once("mysql.inc.php");
mysql_query("UPDATE users SET lastseen=NOW() WHERE username='".$_SESSION["username"]."'");
if($_SESSION['playing']==false) {
	@mysql_query("UPDATE users SET loggedin=TRUE WHERE username='".$_SESSION["username"]."'");
	@mysql_query("INSERT INTO actions VALUES ('',2,".$_SESSION["id"].",NOW(),'".$_SESSION["map"]."',".$_SESSION["xpos"].",".$_SESSION["ypos"].",'".$_SESSION["username"]."');");
	$_SESSION['playing'] = true;
}

$query = "SELECT id,username,xpos,ypos FROM users WHERE id!=".$_SESSION["id"]." AND lastseen>NOW() - INTERVAL 30 SECOND AND loggedin=TRUE AND map='".$_SESSION["map"]."';";
$result = mysql_query($query) or die("-1");
if(mysql_num_rows($result)==0) die("0");
while($row = mysql_fetch_array($result)) {
	echo $row["id"]."\t".$row["username"]."\t".$row["xpos"]."\t".$row["ypos"]."\n";
}
?>