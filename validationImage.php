<?php

require_once("session_mysql.php");
session_start();

if (empty($_SESSION['rand_code'])) {
    $str = "";
    $length = 0;
    for ($i = 0; $i < 4; $i++) {
        // this numbers refer to numbers of the ascii table (small-caps)
        $str .= chr(rand(97, 122));
    }
    $_SESSION['rand_code'] = $str;
}

$imgX = 40;
$imgY = 30;
$image = imagecreatetruecolor($imgX, $imgY);

$backgr_col = imagecolorallocate($image, rand(200,255),rand(200,255),rand(200,255));
$border_col = imagecolorallocate($image, rand(200,255),rand(200,255),rand(200,255));
$text_col = imagecolorallocate($image, rand(0,70),rand(0,70),rand(0,70));

imagefilledrectangle($image, 0, 0, $imgX, $imgY, $backgr_col);
imagerectangle($image, 0, 0, $imgX-1, $imgY-1, $border_col);

$font = "./VeraSe.ttf"; // its a Bitstream font check www.gnome.org for more
$font_size = 10;
$angle = 20;
$box = imagettfbbox($font_size, $angle, $font, $_SESSION['rand_code']);
$x = (int)($imgX - $box[4]) / 2;
$y = (int)($imgY - $box[5]) / 2;
imagettftext($image, $font_size, $angle, $x, $y, $text_col, $font, $_SESSION['rand_code']);

header("Content-type: image/png");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");  // disable IE caching
header("Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
imagepng($image);
imagedestroy ($image);
?>