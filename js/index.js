//轮播功能
var timer=setInterval(autoplay,2000);
var index=0;
function autoplay(){
    if (index==5) {
       $(".fm").css("left",0);
       index=1; 
    }else{
        index++;
    }
    $(".fm").animate({left: -1000*index});
    $(".num li").eq(index==5? 0:index).addClass("active").siblings().removeClass();  
}
$(".banner").hover(function () {
    clearInterval(timer);
    $(".toLeft").animate({opacity: 1});
    $(".toRight").animate({opacity: 1})
},function () {
    timer=setInterval(autoplay,2000);
    $(".toLeft").animate({opacity: 0},1000);
    $(".toRight").animate({opacity: 0},1000)
})
$(".num li").click(function () {
    $(this).addClass("active").siblings().removeClass();
    index=$(this).html()-1;
    $(".fm").css("left",-1000*index);
})
$(".toRight").click(function () {
    if(index==5){
        index=0;
    }
    index++;
    $(".fm").css("left",-1000*index);
    $(".num li").eq(index==5? 0:index).addClass("active").siblings().removeClass(); 
})
$(".toLeft").click(function () {
    if(index==0){
        index=5;
    }
    index--;
    $(".fm").css("left",-1000*index);
    $(".num li").eq(index==5? 0:index).addClass("active").siblings().removeClass(); 
})


