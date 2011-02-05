<?php
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Pragma: no-cache" );
// getMap.php
// echos the map file into the output, or 0 on error
require_once("session_mysql.php");
session_start();
if(!isset($_SESSION["username"])) die("No session");
//require_once("mysql.inc.php");
mysql_query("UPDATE users SET lastseen=NOW() WHERE username='".$_SESSION["username"]."'");

if(!isset($_GET["num"]) || strlen($_GET["num"])<1) die("num is empty");
if(!is_int($_GET["num"]+0)) die("num is not a number");

$result = mysql_query("SELECT filename FROM maps WHERE id=".$_GET["num"]) or die("Error during MySQL query");
if(mysql_num_rows($result)<1) die("No returned results");
$resultarray = mysql_fetch_array($result);
$filename = $resultarray["filename"] . ".map";
mysql_free_result($result);

echo file_get_contents("./maps/".$filename);
?>