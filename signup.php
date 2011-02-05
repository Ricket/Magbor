<?php
require_once("session_mysql.php");
session_start();
?>
<html>
<head>
<title>Magbor - Sign Up</title>
</head>
<body>
<?php
$hasErrors = false;
$fields = array();
$errors = array();
if(isset($_POST["submit"])) validateEntries();

if(!isset($_POST["submit"]) || $hasErrors==true) {
	drawForm();
} else { //submit is posted and has no errors, so make new user
	//@require_once('mysql.inc.php');
	$result = @mysql_query("SELECT id FROM users WHERE UPPER(username)=UPPER('".$fields['username']."');") or die("A database error has occurred. Please try again.");
	if(mysql_num_rows($result)>0) {
		$hasErrors = true;
		$errors['username'] = "Username already exists.";
		drawForm();
	} else {
		$result2 = @mysql_query("INSERT INTO users VALUES ('','".$fields['username']."',MD5('".$fields['password']."'),FALSE,NOW()-INTERVAL 30 SECOND,FALSE,0,0,0,16777215,16777215,16777215,0);") or die("A database error has occurred while adding your character. Please try again.");
		echo 'Your character has been created.<br><br><a href="index.php">Play</a>';
	}
}

function validateEntries() {
	global $hasErrors, $errors, $fields;

	########################################
	# USERNAME			       #
	########################################
	if(empty($_POST['username'])) {
		$hasErrors = true;
		$errors['username'] = "No username specified";
	} else {
		if (!get_magic_quotes_gpc()) {
			$fields['username'] = addslashes($_POST['username']);
		} else {
			$fields['username'] = $_POST['username'];
		}
		if(preg_match("/^[a-zA-Z0-9]{3,12}$/",$fields['username'])==0) {
			$hasErrors = true;
			$errors['username'] = "Invalid username.";
		}
	}

	########################################
	# PASSWORD			       #
	########################################
	if(empty($_POST['password'])) {
		$hasErrors = true;
		$errors['password'] = "No password specified";
	} else {
		if (!get_magic_quotes_gpc()) {
			$fields['password'] = addslashes($_POST['password']);
		} else {
			$fields['password'] = $_POST['password'];
		}
		if(preg_match("/^[a-zA-Z0-9]{4,20}$/",$fields['password'])==0) {
			$hasErrors = true;
			$errors['password'] = "Invalid password.";
		}
	}

	########################################
	# VALIDATOR                            #
	########################################
	if(empty($_POST['validator'])) {
		$hasErrors = true;
		$errors['validator'] = "Please type the letters from the image into here";
	} else {
		if (!get_magic_quotes_gpc()) {
			$fields['validator'] = addslashes($_POST['validator']);
		} else {
			$fields['validator'] = $_POST['validator'];
		}
		if(isset($_SESSION['rand_code'])) {
			if($fields['validator'] != $_SESSION['rand_code']) {
				$hasErrors = true;
				$errors['validator'] = "Please type the letters from the <i>new</i> image into here";
				unset($_SESSION['rand_code']);
			} else {
				//unset($_SESSION['rand_code']);
			}
		} else {
			$hasErrors = true;
			$errors['validator'] = "An error has occurred. Please refresh and try again.";
		}
	}
}

function drawForm() {
	global $errors,$fields;
?>
<table>
<tr><td colspan="2"><font size="+1"><b>New User</b></font></td></tr>
<form action="<?=$PHP_SELF?>" method="POST">
<tr><td colspan="2"><font size="-1">All fields are required</font></td></tr>
<tr><td><b>Username</b><br><font size="-1">3-12 letters and numbers</font></td><td><input type="text" name="username" value="<?=$fields['username']?>" size="12" maxlength="12" /><?php if(!empty($errors['username'])) echo '<font color="red">'.$errors['username'].'</font>'; ?></td></tr>
<tr><td><b>Password</b><br><font size="-1">4-20 letters and numbers</font></td><td><input type="password" name="password" value="<?=$fields['password']?>" size="12" maxlength="20" /><?php if(!empty($errors['password'])) echo '<font color="red">'.$errors['password'].'</font>'; ?></td></tr>
<tr><td><img src="validationImage.php?blah=<?=md5(rand(0,999999).$_SESSION['rand_code'])?>" alt="Type these letters into the box" width="40" height="30" /><br><font size="-1">Just type these letters</font></td><td><input type="text" name="validator" value="<?=$fields['validator']?>" size="12" maxlength="4" /><?php if(!empty($errors['validator'])) echo '<font color="red">'.$errors['validator'].'</font>'; ?></td></tr>
<tr><td colspan="2" align="center"><input type="submit" name="submit" value="Submit" /></td></tr>
</form>
</table>
<?php
} //drawForm
?>
<p align="center"><font size="-1"><a href="index.php">Home</a></font></p>
</body>
</html>