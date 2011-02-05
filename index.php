<?php
require_once("session_mysql.php");
session_start();
?>
<html>
<head>
<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">
<title>Magbor</title>
<script language="Javascript" src="index.js"></script>
</head>
<body>
<p align="center"><h1><u>Magbor</u></h1></p>
<p>Something more interesting will be here soon, when the game is done. I'm thinking, plenty of DHTML/JavaScript. For now, just log in or create a new account.<br>
Source will be released soon, including PHP as well.</p>
<p>
<?php
if(!isset($_SESSION["username"])) {
?>
<form name="loginform" action="login.php" method="post">
Username: <input type="text" name="username" maxlength="12" size="12" /><br>
Password: <input type="password" name="password" maxlength="20" size="12" /><br>
<input type="submit" name="submit" value="Login" /><br>
<a href="signup.php">Create account</a>
</form>
<?php
} else {
?>
You're already logged in!<br>
<a href="login.php">Play game</a>
<?php
}
?>
</p>
</body>
</html>