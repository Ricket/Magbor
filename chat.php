<?php
// These headers might solve caching problems, but they also increase
// bandwidth by quite a lot
// Uncomment only if major problems occur that are unfixable by other methods
// header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
// header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
// header( "Cache-Control: no-cache, must-revalidate" );
// header( "Pragma: no-cache" );


// accessed by AJAX to send a chat message
// requires chat message
// sends to a map
// returns 0 if user is not logged in
require_once("session_mysql.php");
session_start();
if(!isset($_SESSION["username"])) die("0");
if($_SESSION['playing']==false) die("0");
//require_once("mysql.inc.php");

if(empty($_GET["msg"])) {
	// display nearby chat messages
	if(!isset($_SESSION["lastchatupdate"])) {
		$_SESSION["lastchatupdate"] = time();
	}
	$minx = max(((int)$_SESSION["xpos"]-11),0);
	$maxx = min(((int)$_SESSION["xpos"]+11),65535);
	$miny = max(((int)$_SESSION["ypos"]-11),0);
	$maxy = min(((int)$_SESSION["ypos"]+11),65535);
	$query = "SELECT * FROM public_chat WHERE time>NOW() - INTERVAL 30 SECOND AND map=".$_SESSION["map"]." ORDER BY time ASC";
	$result = @mysql_query($query) or die("1\n".mysql_error());
	if(mysql_num_rows($result)!=0) {
		// display the result
		while($row = mysql_fetch_array($result)) {
			echo $row['user']."\t".$row['message']."\n";
		}
	}
	$_SESSION["lastchatupdate"] = time();

	// now clean up messages that are older than 30 seconds
	// comment this to log everything said
	// but it will take up a lot of room
	@mysql_query("DELETE FROM public_chat WHERE time<NOW() - INTERVAL 30 SECOND;") or die();
} else {
	die("0");
	// insert new chat message
	if (!get_magic_quotes_gpc()) {
		$message = addslashes($_GET['msg']);
	} else {
		$message = $_GET['msg'];
	}

	$query = "INSERT INTO public_chat VALUES ('','".$_SESSION["username"]."',NOW(),'".$_SESSION["map"]."','".$message."');";
	$result = mysql_query($query);
	if(!$result){
		if(stristr(mysql_error(),'duplicate')) {
			@mysql_query("ALTER TABLE public_chat AUTO_INCREMENT=0;") or die("1");
			@mysql_query($query) or die("1");
		} else {
			die("1");
		}
	}
}
?>