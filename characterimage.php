<?php
@require_once("session_mysql.php");
session_start(); // necessary to open mysql connection

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");  // disable IE caching
header("Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

if(!isset($_GET["id"]) || strlen($_GET["id"])<1) die("0\nParameter error");
$id = (int)$_GET["id"];
//if(!isset($_GET["stance"]) || strlen($_GET["stance"])<1) die("0\nParameter error");
//$stance = (int)$_GET["stance"];

$result = @mysql_query("SELECT headcolor,bodycolor,legscolor,outlinecolor FROM users WHERE id=".$id.";") or die("MySQL error");
if(mysql_num_rows($result)<1) {
	die("No such user");
}
$resultRows = @mysql_fetch_array($result);
$headcolor = (int)($resultRows['headcolor']);
$bodycolor = (int)($resultRows['bodycolor']);
$legscolor = (int)($resultRows['legscolor']);
$outlinecolor = (int)($resultRows['outlinecolor']);


$image = @imagecreatefromgif("./images/manstand2.gif");
if(!$image) {
	die("Error retrieving base gif");
}
ImageAlphaBlending($image,true);  //should already be on?

$backgroundcolorref = ImageColorAllocate($image,255,255,255);
ImageColorTransparent($image,$backgroundcolorref);
$headcolorref =       ImageColorAllocate($image,(($headcolor>>16)&255),(($headcolor>>8)&255),(($headcolor)&255)); //red
$bodycolorref =       ImageColorAllocate($image,(($bodycolor>>16)&255),(($bodycolor>>8)&255),(($bodycolor)&255)); //green
$legscolorref  =      ImageColorAllocate($image,(($legscolor>>16)&255),(($legscolor>>8)&255),(($legscolor)&255)); //blue
$outlinecolorref =    ImageColorAllocate($image,(($outlinecolor>>16)&255),(($outlinecolor>>8)&255),(($outlinecolor)&255)); //black

// apply background
imagefill($image,0,0,$backgroundcolorref);

// apply head color
imagefill($image,14,8,$headcolorref);

// apply body color
imagefill($image,15,14,$bodycolorref);

// apply leg color
imagefill($image,15,17,$legscolorref);

// apply outline color
//       [fills:]
imagefill($image,14,3,$outlinecolorref);
imagefill($image,12,6,$outlinecolorref);
imagefill($image,18,6,$outlinecolorref);
imagefill($image,15,9,$outlinecolorref);
imagefill($image,13,10,$outlinecolorref);
imagefill($image,17,10,$outlinecolorref);
imagefill($image,15,18,$outlinecolorref);
//       [pixels:]
imagesetpixel($image,13,4,$outlinecolorref);
imagesetpixel($image,17,4,$outlinecolorref);
imagesetpixel($image,13,8,$outlinecolorref);
imagesetpixel($image,17,8,$outlinecolorref);

header("Content-type: image/gif");
imagegif($image);
imagedestroy($image);

?>