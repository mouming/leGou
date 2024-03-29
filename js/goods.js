$("#mainhead").load("mainhead.html",function(){
            
});     
$("#head").load("header.html",function (){
    if(newGoods.name){
        // $(".header .list1").clone().insertAfter($(".header .list2")).css("float","right");
        // $(".header .list1").eq(0).remove();
        $(".header .list1 li").eq(0).remove();
        $(".header .list1 li").eq(0).html("Hi,<a href='myCenter.html?uname="+newGoods.name+"'>"+newGoods.name+"</a>");
        $(".header .list1 li").eq(1).html("<a href='../index.html?a'>[退出]</a>").css("marginLeft","20px");
        //设置个人中心超链接
        $(".header .list2").find("a").eq(0).attr("href","myCenter.html?uname="+newGoods.name);
    }
})
$("#foot").load("footer.html",function (){
})
$("#side").load("sidebar.html",function (){
    if(newGoods.name){
        $(".side-cart").attr("href","cart.html?uname="+newGoods.name);
        $(".side-collect").attr("href","collect.html?uname="+newGoods.name);
    }
    $(".sidebar").find("a").mouseover(function(){
        $(this).next().css("display","block");
    }).mouseout(function(){
        $(this).next().css("display","none");
    })
})
function GoodsInit(){
    this.goodsEle=$("#goods");
    this.goods=[];
    this.name="";

}
GoodsInit.prototype.init=function(){
    this.getGoods();
    this.changePage();
    this.name=this.hasLocationName("uname");
}
GoodsInit.prototype.getGoods=function(){//从数据库中获得所有商品信息
    //判断url中是否有class属性，并且得到属性值，按属性值分类显示；
    var uArr=decodeURIComponent(location.search).substr(1).split("&");  
    // console.log(uArr)
    $.getJSON("../json/goods.json",function(res){
        // console.log(res);
       for(var i=0;i<res.length;i++){
           for(var j=0;j<uArr.length;j++){                   
              if(res[i].class==uArr[j].split("=")[1]){
                this.goods.push(res[i]);//得到商品数据；
              }
           }    
        }   
        this.showData();
        this.gCookie();
    }.bind(this));
}
GoodsInit.prototype.showData=function(){//在页面显示商品信息
    var str="";
    var str1="";
    var ctr="";//商品页
    var cArr=["暂无评价","1条评价","15条评价","58条评价","176条评价","388条评价","暂无评价","818条评价","1125条评价"]
    var t=this.goods.length;
    $(".unList p").html("为您搜索到"+8*t+"个商品<i>1</i>/<span>"+Math.ceil(8*t/10)+"</span>"); 
    for(var i=1;i<=Math.ceil(8*t/10);i++){
        if(i==1){
            ctr =`
            <li class="on">${i}</li>
        `;
        }else{
            ctr +=`
            <li >${i}</li>
        `;
        }    
    }
    $(".content .page").html(ctr);
    $.each(this.goods,function(index,ele){//动态添加第一行数据
        // console.log(ele);
        // var rand=getRand(0,7);//随机获取评价数
        str += `
            <li>
                <div class="getId">${ele.uid}</div>
                <img src="../img/${ele.src}" alt="">
                <h5>${ele.name}</h5>
                <p>￥${ele.price}.00</p>
                <p class="iconfont eval">
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe605;</i>
                    <span>${cArr[getRand(0,7)]}</span>
                </p>
                <p class="buy">立即购买</p>
                <div class="collect iconfont">&#xe60a;</div>
            </li> 
        `;
    });
    this.goodsEle.append(str);
    for(var i=0;i<35;i++){//动态添加其他行数据
        var rand=getRand(0,4);
        str1 =`
           <li>
                <div class="getId">${this.goods[rand].uid}</div>
                <img src="../img/${this.goods[rand].src}" alt="">
                <h5>${this.goods[rand].name}</h5>
                <p>￥${this.goods[rand].price}.00</p>
                <p class="iconfont eval">
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe605;</i>
                    <span>${cArr[getRand(0,7)]}</span>
                </p>
                <p class="buy">立即购买</p>
                <div class="collect iconfont">&#xe60a;</div>
            </li> 
        `;   
        this.goodsEle.append(str1);   
     } 
     //给首页添加链接
    if(this.name) {
        $(".topList a").attr("href","../index?uname="+this.name);
    }
} 

GoodsInit.prototype.changePage=function(){//点击换页
    //点击下一页；
    var i=1;
    var l;
    $(".nextpage").click(function(){//点击下一页
        // console.log($(".unList p span").html());
        if(i==$(".unList p span").html()){
            i=$(".unList p span").html();
        }else{
            i++;
        }
        l=-836*(i-1);
        $("#goods").animate({top:l},0);
        $(".unList p i").html(i);
        $("#page li").each(function(index,ele){
            if(index==(i-1)){
                $(this).addClass("on").siblings().removeClass();
            }
        });
        // $("#page").children(i).addClass("on").siblings().removeClass();
    })
    //点击上一页
    $(".leftpage").click(function(){
        if(i==1){
            i=1;
        }else{
            i--;
        }
        l=-836*(i-1);
        $("#goods").animate({top:l},0);
        $(".unList p i").html(i);
        $("#page li").each(function(index,ele){
            if(index==(i-1)){
                $(this).addClass("on").siblings().removeClass();
            }
        });
    })
    //点击数字，显示对应页；  
    $("#page").on("click","li",function () {
        i=$(this).html();
        l=-836*(i-1);
        $("#goods").animate({top:l},0);
        $(this).addClass("on").siblings().removeClass();
        $(".unList p i").html(i);
    })    
    //点击unList下的条件，商品排序显示；
    $(".unList ").on("click","li",function(){//点击的li字体获得class="sort"
        $(this).addClass("sort").siblings().removeClass();
    })
}

//判断url中是否存在name查询串的方法封装
GoodsInit.prototype.hasLocationName=function(name){
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
//页面刷新时，判断是否有收藏的cookie信息
GoodsInit.prototype.gCookie=function(){
    var flag=true;//表示没有登录
    var sArr=decodeURIComponent(location.search).substr(1).split("&");
    var uname="";
    for(var i=0;i<sArr.length;i++){
        if(sArr[i].split("=")[0]==="uname"){//存在表示已经登录
            flag=false;
            uname=sArr[i].split("=")[1];
            break;
        }
    }
    if(!flag){//如果已经登录
        if(getCookieName(uname+"collect")){//如果有，则保存收藏状态
        var cGoods = JSON.parse(getCookieName(uname+"collect"));
            if(cGoods !=[]){ 
                var myGoods=$("#goods").find("li");  
                for(var i=0;i<cGoods.length;i++){
                    // console.log(cGoods[i].uid);
                    myGoods.each(function(index,ele){
                        if($(this).children()[0].innerHTML===cGoods[i].uid){
                            $(this).children()[6].style="color:rgb(255, 198, 0)";
                        }
                    })
                }  
            }
        }  
     } 
     //设置星星评价数
    $("#goods").find("li").each(function(index,ele){
        // console.log($(this).find(".buy").html());
            var rand="";
            if($(this).find("span").html()==="暂无评价"){
                 rand=0;
            }else{
                rand=getRand(1,5);
            }
            for(var j=0;j<rand;j++){
             $(this).find("i").eq(j).addClass("color");    
            }    
    });   
}  


var newGoods=new GoodsInit();
newGoods.init();

$("#goods").on("click",(".collect"),function(e){//点击收藏
    e.stopPropagation();
        //首先判断是否登录;
    var flag=true;//表示没有登录
    var sArr=decodeURIComponent(location.search).substr(1).split("&");
    var uname="";
    for(var i=0;i<sArr.length;i++){
        if(sArr[i].split("=")[0]==="uname"){//存在表示已经登录
            flag=false;
            uname=sArr[i].split("=")[1];
            break;
        }
    }
    if(flag){//没有登录，跳转到登录页
        alert("请登录");location.href="login.html";
    }else{//已经登录，则可以收藏
        // console.log(uname)
        var rgb=$(this).css("color");
        var uid = this.parentNode.children[0].innerHTML;
        //根据颜色判断是否已收藏；
        if(rgb==="rgb(212, 212, 212)"){//未收藏
            var date=new Date();
            date.setDate(date.getDate()+10);
                if(getCookieName(uname+"collect")){//已经有收藏信息
                    var cGoods = JSON.parse(getCookieName(uname+"collect"));
                    // console.log(cGoods);
                    var obj={
                        uid:uid
                    }
                    cGoods.push(obj);
                    setCookie(uname+"collect",JSON.stringify(cGoods),date,"/");  
                }else{//没有收藏cookie信息
                    var arr=[
                        { uid:uid}//创建一个数组，存放第一条cookie信息(商品编号)；     
                    ]
                    setCookie(uname+"collect",JSON.stringify(arr),date,"/");
                }
           $(this).css("color","rgb(255, 198, 0)"); //已收藏；
        }else{//已收藏
            $(this).css("color","rgb(212, 212, 212)");//取消收藏
            //删除对应的cookie信息；
            var cGoods = JSON.parse(getCookieName(uname+"collect"));
            for(var i=0;i<cGoods.length;i++){
                if(cGoods[i].uid===uid){
                    cGoods.splice(i,1);
                }
            }
            // console.log(cGoods);
            setCookie(uname+"collect",JSON.stringify(cGoods),date,"/");
        } 
    }        
}); 

$("#goods").on("mouseenter","li",function (e){//移入li,显示收藏状态；
    e.stopPropagation();
    $(this).children(".collect").css("display","block");  
});  
$("#goods").on("mouseleave","li",function (e){//移出li,隐藏收藏状态；
    e.stopPropagation();
     $(this).children(".collect").css("display","none");
})
$("#goods").on("click","li",function (){//点击li,跳转到详情页；
    // e.stopPropagation();
    var uid=encodeURIComponent($(this).children()[0].innerHTML);
    if(newGoods.name){
        location.href="productdetails.html?uid="+uid+"&uname="+newGoods.name;
    }else{
        location.href="productdetails.html?uid="+uid;
    }       
});