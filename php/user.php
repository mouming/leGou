<?php
    include("public.php");
    if(empty($_GET["uname"])){
        $uname=$_POST["uname"];
        $address=$_POST["address"];
        $sql="update user set address='$address' where uname='$uname'";
        $result=ConnectMysql($sql);
    }else{
        $uname=$_GET["uname"];
        $sql="select address from user where uname='$uname'";
        $result=ConnectMysql($sql);
        $arr=mysqli_fetch_array($result);
        if($arr){
            echo $arr["address"];
        }else{
            echo "";
        }
    }
?>