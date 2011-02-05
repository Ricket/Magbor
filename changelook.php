<?php
require_once("session_mysql.php");
session_start();

if(!isset($_SESSION["username"])) {
	die('You aren\'t logged in!<br><a href="index.php">Back to home</a>');
}

if(isset($_GET["head"]) && isset($_GET["body"]) && isset($_GET["legs"]) && isset($_GET["outline"])) {
	// do stuff here!
	$headcolor = (int)($_GET['head']);
	$bodycolor = (int)($_GET['body']);
	$legscolor = (int)($_GET['legs']);
	$outlinecolor = (int)($_GET['outline']);
	if(($headcolor<0 || $headcolor>16777215) || ($bodycolor<0 || $bodycolor>16777215) || ($legscolor<0 || $legscolor>16777215) || ($outlinecolor<0 || $outlinecolor>16777215)) {
		die("Invalid numbers. No cheating/hacking allowed.");
	} else {
		//@require_once("mysql.inc.php");
		@mysql_query("UPDATE users SET headcolor=".$headcolor.", bodycolor=".$bodycolor.", legscolor=".$legscolor.", outlinecolor=".$outlinecolor." WHERE id=".$_SESSION["id"].";") or die("A database error occurred. Try refreshing.");
		$_SESSION["headcolor"] = $headcolor;
		$_SESSION["bodycolor"] = $bodycolor;
		$_SESSION["legscolor"] = $legscolor;
		$_SESSION["outlinecolor"] = $outlinecolor;
		echo 'Your look has been updated.<br><a href="login.php">Back</a>';
	}
	exit();
}
?>
<html>
<head>
<title>Magbor - Change Look</title>
<!-- COLOR PICKER: -->
<link rel="stylesheet" href="js_color_picker_v2.css" media="screen">
<script src="color_functions.js"></script>
<script type="text/javascript" src="js_color_picker_v2.js"></script>
<!-- ------------- -->
<script language="Javascript">
var headColor = <?=$_SESSION["headcolor"]?>;
var bodyColor = <?=$_SESSION["bodycolor"]?>;
var legsColor = <?=$_SESSION["legscolor"]?>;
var outlineColor = <?=$_SESSION["outlinecolor"]?>;

function updatePreview() {
	document.getElementById("previewImg").src = "characterpreview.php?head="+headColor+"&body="+bodyColor+"&legs="+legsColor+"&outline="+outlineColor;
}

function saveChar() {
		location.href="changelook.php?head="+headColor+"&body="+bodyColor+"&legs="+legsColor+"&outline="+outlineColor;
}

function headColorPicked(newcolor) {
	headColor = rgbTo24Bit(newcolor);
	document.getElementById("headColor").style.backgroundColor = newcolor;
	updatePreview();
}

function bodyColorPicked(newcolor) {
	bodyColor = rgbTo24Bit(newcolor);
	document.getElementById("bodyColor").style.backgroundColor = newcolor;
	updatePreview();
}

function legsColorPicked(newcolor) {
	legsColor = rgbTo24Bit(newcolor);
	document.getElementById("legsColor").style.backgroundColor = newcolor;
	updatePreview();
}

function outlineColorPicked(newcolor) {
	outlineColor = rgbTo24Bit(newcolor);
	document.getElementById("outlineColor").style.backgroundColor = newcolor;
	updatePreview();
}
</script>
</head>
<body>
<p align="center"><font size="+2">Design Your Character!</font></p>
<table>
<tr>
<td rowspan="4"><img id="previewImg" src="characterpreview.php?head=<?=$_SESSION["headcolor"]?>&body=<?=$_SESSION["bodycolor"]?>&legs=<?=$_SESSION["legscolor"]?>&outline=<?=$_SESSION["outlinecolor"]?>" width="60" height="60" /></td>
<td align="right">Head:&nbsp;<div id="headColor" style="display:inline;background-color:#<?=base_convert((int)$_SESSION['headcolor'],10,16)?>;width:100px;cursor:pointer; border:1px solid #000000;" onclick="showColorPicker(this,headColor,headColorPicked);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
</tr><tr>
<td align="right">Body:&nbsp;<div id="bodyColor" style="display:inline;background-color:#000000;width:100px;cursor:pointer; border:1px solid #000000;" onclick="showColorPicker(this,bodyColor,bodyColorPicked);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
</tr><tr>
<td align="right">Legs:&nbsp;<div id="legsColor" style="display:inline;background-color:#000000;width:100px;cursor:pointer; border:1px solid #000000;" onclick="showColorPicker(this,legsColor,legsColorPicked);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
</tr><tr>
<td align="right">Outline:&nbsp;<div id="outlineColor" style="display:inline;background-color:#000000;width:100px;cursor:pointer; border:1px solid #000000;" onclick="showColorPicker(this,outlineColor,outlineColorPicked);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
</tr>
<tr>
<td colspan="2" align="center"><input type="button" value="Save" onclick="saveChar()" /></td>
</tr>
</table>
<p align="center"><font size="-1"><a href="login.php">Back</a></font></p>
<script language="Javascript">
document.getElementById("bodyColor").style.backgroundColor = bitToRGB(<?=$_SESSION["bodycolor"]?>);
document.getElementById("legsColor").style.backgroundColor = bitToRGB(<?=$_SESSION["legscolor"]?>);
document.getElementById("outlineColor").style.backgroundColor = bitToRGB(<?=$_SESSION["outlinecolor"]?>);
</script>
</body>
</html>