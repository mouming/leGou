
//导入头部和尾部以及右侧悬浮栏
$(".header").load("header.html",function (){
    if(showpay.name){
        // $(".header .list1").clone().insertAfter($(".header .list2")).css("float","right");
        // $(".header .list1").eq(0).remove();
        $(".header .list1 li").eq(0).remove();
        $(".header .list1 li").eq(0).html("Hi,<a href='myCenter.html?uname="+showpay.name+"'>"+showpay.name+"</a>");
        $(".header .list1 li").eq(1).html("<a href='../index.html?a'>[退出]</a>").css("marginLeft","20px");
    }
})
function showPay(){
    this.name="";
    this.money="";
    this.getOrder="";
    this.towHourData="";
}
    // 页面初始化
    showPay.prototype.init=function (){
    // 将url中获取的用户名存入name中
    this.name= this.hasLocationName("uname");
    // 从url中获取付款金额存入this.money中
    this.money=this.hasLocationName("money");
    // 从url中获取付款订单号存入this.money中
    this.getOrder=this.hasLocationName("orderKey");
    // 生成订单号
    this.createOrder();
    //生成金额数
    this.createMoney();
    //两小时倒计时
    this.countdown();
    //切换支付页面
    this.clickPay();
}
//判断url中是否存在name查询串的方法封装
showPay.prototype.hasLocationName=function (name){
    var str=location.search.substr(1);
    var uname="";
    if(str){
        var arr=str.split("&");
        arr.forEach(function (item){
            if(item.split("=")[0]===name){
                uname= decodeURIComponent(item.split("=")[1]);
                return false;
            }
        })
    }
    return uname;
}

showPay.prototype.createOrder=function (){
    $("#order_num").html(this.getOrder);
}
showPay.prototype.createMoney=function(){
    $(".pay_money").find("span").html(this.money);
}
showPay.prototype.countdown=function (){
    var end=new Date();
    end.setHours(end.getHours()+2);
    var _this=this;
    var timer=setInterval(function(){
        _this.showTime(end);
    },1000);
    if($(".order_number").eq(1).html()==="商品已逾期，订单已取消"){
        clearInterval(timer);
    }
}
showPay.prototype.showTime=function (end){
    var now=new Date();
    var t=(end.getTime()-now.getTime())/1000;
    if(t<0){
        $("#time").parent().html("商品已逾期，订单已取消");
    }
    //剩余的小时数 
    var h =parseInt( t/3600 );
    //剩余分钟
    var m = parseInt( (t - h*3600)/60 );
    //剩余的秒
    var s = parseInt(t - h * 3600 - m * 60) ;
    $("#time").html(h + "小时" + m + "分钟" + s + "秒") ;
}
showPay.prototype.clickPay=function(){
    $(".pay_tab ul li").click(function(){
        $(".pay_code .pay_content").css("display","none").eq($(this).index()).css("display","block");
        $(".pay_tab ul li").removeClass("click_on");
        $(this).addClass("click_on");
    })
}
var showpay=new showPay();
showpay.init();
