<?php
    header("Content-Type:text/html;charset=utf-8");
    function ConnectMysql($sql){
        $db=mysqli_connect("localhost","root","","shopping");
        mysqli_query($db,"set names utf8");
        return  mysqli_query($db,$sql);
    }

?>