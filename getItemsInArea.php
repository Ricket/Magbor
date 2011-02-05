<?php
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Pragma: no-cache" );
// getUsersInArea.php
// gets all the items on the logged-in players map
require_once("session_mysql.php");
session_start();

$numOfRows = 0;

if(!isset($_SESSION["username"])) {
	exit();
}

if($_SESSION["playing"]==false) $_SESSION["playing"]=true;

//require_once("mysql.inc.php");
mysql_query("UPDATE users SET lastseen=NOW() WHERE username='".$_SESSION["username"]."'") or die("-1\n".mysql_error());
if($_SESSION['playing']==false) {
	@mysql_query("UPDATE users SET loggedin=TRUE WHERE username='".$_SESSION["username"]."'");
	@mysql_query("INSERT INTO actions VALUES ('',2,".$_SESSION["id"].",NOW(),'".$_SESSION["map"]."',".$_SESSION["xpos"].",".$_SESSION["ypos"].",'".$_SESSION["username"]."');");
	$_SESSION['playing'] = true;
}

$result = mysql_query("SELECT id,typeid,xpos,ypos FROM items WHERE playerid=0 AND map=".$_SESSION["map"].";") or die("-1\n".mysql_error());
if(mysql_num_rows($result)!=0) {
	$numOfRows += mysql_num_rows($result);
	while($row = mysql_fetch_array($result)) {
		echo $row["id"]."\t".$row["typeid"]."\t".$row["xpos"]."\t".$row["ypos"]."\n";
	}
}

$result2 = mysql_query("SELECT id,typeid FROM items WHERE playerid=".$_SESSION["id"].";") or die("-1\n".mysql_error());
if(mysql_num_rows($result2)!=0) {
	$numOfRows += mysql_num_rows($result2);
	while($row = mysql_fetch_array($result2)) {
		echo $row["id"]."\t".$row["typeid"]."\n";
	}
}

if($numOfRows == 0) {
	echo '0';
}
?>