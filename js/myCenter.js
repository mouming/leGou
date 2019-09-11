
$("#mainhead").load("mainhead.html");
    //导入头部和尾部以及右侧悬浮栏
    $("#header").load("header.html",function (){
    if(nameCenter){
        // $(".header .list1").clone().insertAfter($(".header .list2")).css("float","right");
        // $(".header .list1").eq(0).remove();
        $(".header .list1 li").eq(0).remove();
        $(".header .list1 li").eq(0).html("Hi,<a href='myCenter.html?uname="+nameCenter+"'>"+nameCenter+"</a>");
        $(".header .list1 li").eq(1).html("<a href='../index.html?a'>[退出]</a>").css("marginLeft","20px");
        //设置个人中心超链接
        $(".header .list2").find("a").eq(0).attr("href","myCenter.html?uname="+nameCenter);
    }
})
$("#footer").load("footer.html",function (){
})
$("#side").load("sidebar.html",function (){
    if(nameCenter){
        $(".side-cart").attr("href","cart.html?uname="+nameCenter);
        $(".side-collect").attr("href","collect.html?uname="+nameCenter);
    }
    $(".sidebar").find("a").mouseover(function(){
        $(this).next().css("display","block");
    }).mouseout(function(){
        $(this).next().css("display","none");
    })
})
var nameCenter=hasLocationName("uname");
if(nameCenter){
    $(".form_menu a").attr("href","../index.html?uname="+nameCenter);
}
$(function(){
    $(".left_myOrder").click(function(){
        $("#map_title").html($(this).find("a").html());
        $(".bx").hide();
        $(".bx").eq(0).show();
        $(this).css({
            background:"#fff",
            "border-left":"2px solid #DA0C18"
        });
        $(".ser").css({
            background:"#F8F8F8",
            "border-left":"none"
        });
    });
});


$(function(){
    $(".ser").click(function(){
        $("#map_title").html($(this).find("a").html());
        $(".bx").eq(0).hide();
        
        $(".bx").eq($(this).attr("index")).show().siblings(".bx").hide();
        $(this).css({
            background:"#fff",
            "border-left":"2px solid #DA0C18"
        }).siblings().css({
            background:"#F8F8F8",
            "border-left":"none"
        });
        $(".left_myOrder").css({
            background:"#F8F8F8",
            "border-left":"none"
        });
    });
});


    $(".bb").click(function(){
        $(".aa").eq($(this).attr("index")).show().siblings(".aa").hide();
        $(this).addClass("bt").siblings(".bb").removeClass("bt");
    });

    $(".cc").click(function(){
        $(".dd").eq($(this).attr("index")).show().siblings(".dd").hide();
        $(".installQuery").show();
        $(this).addClass("bi").siblings(".cc").removeClass("bi");
    });
    $(".cc").eq(0).click(function(){
        $(".installQuery").hide();
    });

    // $("#chooseTime").blur(function(){
    //     if($("#chooseTime").val()){
    //         $("#timeError").hide();
    //     }else{
    //         $("#timeError").show().html();
    //     }
    // });
    // $("#chooseTime").keydown(function(){
    //     $("#timeError").hide();
    // });

    function ab(a,b){
        $(a).blur(function(){
        if($(a).val()){
            $(b).hide();
        }else{
            $(b).show().html();
        }
        $(a).keydown(function(){
        $(b).hide();
    });
    });
    }
    ab("#chooseTime","#timeError");
    ab("#linkMan",".linkError");
    ab("#phone",".phoneError");

//判断url中是否存在name查询串的方法封装
function hasLocationName(name){
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
            
