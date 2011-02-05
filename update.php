<?php
//header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
//header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
//header( "Cache-Control: no-cache, must-revalidate" );
//header( "Pragma: no-cache" );
header("Date:");
header("X-Powered-By");
// update.php
// gets all actions from a certain time ago
// also acts as a ping, updating lastseen

require_once("session_mysql.php");
session_start();

if(!isset($_SESSION["username"])) {
	die("0\nNot logged in");
}

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

###########################
# REMOVE OLD CHATS        #
###########################
$chatCleanRes = mysql_query("DELETE FROM public_chat WHERE map=".$_SESSION["map"]." AND time<NOW() - INTERVAL 30 SECOND;") or die();
if(@mysql_affected_rows()>0) {
	mysql_query("INSERT INTO actions VALUES ('',4,0,NOW(),".$_SESSION["map"].",0,0,'');") or die();
}
###########################

@mysql_query("UPDATE users SET lastseen=NOW() WHERE id=".$_SESSION["id"].";") or die("0\nMySQL error");

if(!isset($_SESSION["lastupdate"])) {
	$_SESSION["lastupdate"] = -1;
}

if($_SESSION["playing"]==false) $_SESSION["playing"]=true;

//$minx = max(((int)$_SESSION["xpos"]-11),0);
//$maxx = min(((int)$_SESSION["xpos"]+11),65535);
//$miny = max(((int)$_SESSION["ypos"]-11),0);
//$maxy = min(((int)$_SESSION["ypos"]+11),65535);

$query = "SELECT * FROM actions WHERE id>".$_SESSION["lastupdate"]." AND playerid!=".$_SESSION["id"]." AND map='".$_SESSION["map"]."' AND time<=NOW() ORDER BY time ASC;";
$result = mysql_query($query) or die("0\nMySQL error\n".$query);
if(mysql_num_rows($result)==0) {
	die("1\nNo rows");
}
while($row = mysql_fetch_array($result)) {
	if((int)$row["id"] > (int)$_SESSION["lastupdate"]) $_SESSION["lastupdate"] = (int)$row["id"];
	
	if((int)$row['actionid'] == 1) {
		// it is a walk action, update the player's X and Y and delete previous
		//query update users set x and y where id is session id
		//query delete from actions where actionid is 1 and time is earlier than this row's time
	}
	echo $row["actionid"]."\t".$row["playerid"]."\t".$row["time"]."\t".$row["xpos"]."\t".$row["ypos"]."\t".$row["parameters"]."\n";
}
?>