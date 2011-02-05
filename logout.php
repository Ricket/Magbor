<?php
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Pragma: no-cache" );
// Initialize the session.
// If you are using session_name("something"), don't forget it now!
require_once("session_mysql.php");
session_start();
if(!isset($_SESSION["username"])) {
	$_SESSION = array();
	if (isset($_COOKIE[session_name()])) {
	   setcookie(session_name(), '', time()-42000, '/');
	}
	session_destroy();
	header("Location: index.php");
}
//require_once("mysql.inc.php");
@mysql_query("UPDATE users SET lastseen=NOW() - INTERVAL 30 SECOND, loggedin=FALSE WHERE username='".$_SESSION["username"]."'");
@mysql_query("DELETE FROM actions WHERE playerid=".$_SESSION["id"].";");
@mysql_query("INSERT INTO actions VALUES ('',3,".$_SESSION["id"].",NOW(),'".$_SESSION["map"]."',".$_SESSION["xpos"].",".$_SESSION["ypos"].",'');");

// Unset all of the session variables.
$_SESSION = array();

// If it's desired to kill the session, also delete the session cookie.
// Note: This will destroy the session, and not just the session data!
if (isset($_COOKIE[session_name()])) {
   setcookie(session_name(), '', time()-42000, '/');
}

// Finally, destroy the session.
session_destroy();
?>
<html>
<head>
<title>Logged out</title>
<script language="Javascript">
function logBackIn() {
if(typeof(self.makeLoginForm) == "function") {
makeLoginForm();
} else {
location.href="index.php";
}
}
</script>
</head>
<body>
<p>You have been logged out of Magbor.</p>
<p><a href="javascript:void(logBackIn())">Log back in?</a></p>
</body>
</html>