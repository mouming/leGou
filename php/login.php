<?php
	include("public.php");
	
	
	if(empty($_POST["uname"])){//返回1说明 表示用户名的请求信息没有
		//直接从主页过来，并且是之前有过登录状态记录
		if(!empty($_COOKIE["token"])){
			$token = $_COOKIE["token"];//只要过来了一定会有token状态 信息
			//根据token信息从数据库中查询该条记录，直接登录成功并跳转
			$selectToken = "select * from user where token='$token'";
			$result =ConnectMysql($selectToken);
			$tokenArr = mysqli_fetch_array($result);
			if($tokenArr){
				echo "<script>location.href = '../index.html?uname=".$tokenArr["uname"]."'</script>";
			}else{
				echo "<script>location.href = '../index.html?card=off'</script>";
			}	
		}else{
			echo "<script>location.href = '../index.html?card=off'</script>";
		}
	}else{
		//从登录窗口过来
	$uname = $_POST["uname"];
		$pwd = $_POST["pwd"];
		$sql = "select * from user where uname='$uname'";
		$result = ConnectMysql($sql);
		$arr = mysqli_fetch_array($result);
		if($arr){//用户存在
			if($arr["upwd"] == $pwd){
				//登录成功
				//选中了自动登录
				if(!empty( $_POST['check'])){
				
					//修改数据库中的登录状态，token字段修改
					$updateToken = "UPDATE `user` SET `token`= '".$_COOKIE["token"]."' WHERE uname='$uname'";
					ConnectMysql($updateToken);
				}
				//将登录用户名携带跳转过去
				echo "<script>alert('登录成功！');location.href = '../index.html?uname=".$arr["uname"]."'</script>";
				
			}else{
				//密码有误
				echo "<script>alert('密码有误！');location.href = '../html/login.html'</script>";
			}
		}else{//用户不存在
			echo "<script>alert('用户名不存在！');location.href = '../html/login.html'</script>";
		}	
		
	
	}
	
	

?>