<?php
header("Content-Type:text/html;charset=utf-8");

	$uname = $_GET["uname"];
	$pwd = $_GET["pwd"];
	//将信息保存到数据库
	$db = mysqli_connect("localhost","root","","shopping");
	mysqli_select_db($db,"shopping");
	mysqli_query($db,"set names utf8");
	$sql = "insert into user (uname,upwd) values ('$uname','$pwd')";
	$row = mysqli_query($db,$sql);

	if($row){//说明是注册成功
		//跳转到登录页面
		echo "<script>alert('注册成功');location.href='../html/login.html';</script>";
		
	}else{//保存失败说明 注册失败
		//跳转到注册页面
		echo "<script>alert('注册失败，请重新注册！');location.href='../html/register.html';</script>";
	}
?>