<?php
	//验证用户名唯一
    include("public.php");
	$uname = $_POST["uname"];
	$sql = "select uname from user where uname='$uname'";
	//echo $sql;
	$result = ConnectMysql($sql);
	
	$arr = mysqli_fetch_array($result);
	if($arr){
		echo 1;
	}else{
		echo 0;
	}
?>