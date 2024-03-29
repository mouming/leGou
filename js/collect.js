
//导入头部和尾部以及右侧悬浮栏       
$(".header").load("header.html",function (){
    $(".header .list1").clone().insertAfter($(".header .list2")).css("float","right");
    $(".header .list1").eq(0).remove();
    $(".header .list1 li").eq(0).remove();
    $(".header .list1 li").eq(0).html("Hi,<a href='myCenter.html?uname="+showCollect.name+"'>"+showCollect.name+"</a>");
    $(".header .list1 li").eq(1).html("<a href='../index.html?a'>[退出]</a>").css("marginLeft","20px");
    //设置个人中心超链接
    $(".header .list2").find("a").eq(0).attr("href","myCenter.html?uname="+showCollect.name);
});
$(".mainhead").load("mainhead.html",function (){
    
});
$(".footer").load("footer.html",function (){
})
$(".sidebar").load("sidebar.html",function (){
    if(showCollect.name){
        $(".side-cart").attr("href","cart.html?uname="+showCollect.name);
        $(".side-collect").attr("href","collect.html?uname="+showCollect.name);
    }
    $(".sidebar").find("a").mouseover(function(){
        $(this).next().css("display","block");
    }).mouseout(function(){
        $(this).next().css("display","none");
    })
})
function ShowCollect(){
    this.name="";
    this.cookieCollect=[];
    this.jsonData=[];
}
ShowCollect.prototype.init=function (){
    this.name=this.hasLocationName("uname");
    this.getJsonData();
}
//判断url中是否存在name查询串的方法封装
ShowCollect.prototype.hasLocationName=function (name){
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
// 获取cookiecarts的数据
ShowCollect.prototype.getCookieData=function (){
    this.cookieCollect=JSON.parse(getCookieName(this.name+"collect"));
}
// 获取json 中的商品数据
ShowCollect.prototype.getJsonData=function (){
    var _this=this;
    $.getJSON("../json/goods.json",function (data){
        _this.jsonData=data;
        // 判断页面显示的内容
        _this.judgePage();
    });
}

//根据cookie判断显示页面情况
ShowCollect.prototype.judgePage=function (){
    if(!(getCookieName(this.name+"collect")=="[]"||(!getCookieName(this.name+"collect")))){
        $(".collectWrap").css("display","block");
        $(".none_collect").css("display","none");
        // 获取cookie中的数据
        this.getCookieData();
        //显示具体收藏的商品
        this.showGoods();
        //统计藏品数量
        this.addCollectNum();
        //商品添加删除功能
        this.deleteGood();
    }else{
        $(".collectWrap").css("display","none");
        $(".none_collect").css("display","block");
    }
}
//显示收藏的商品
ShowCollect.prototype.showGoods=function (){
    var _this=this;
    var str='';
    this.jsonData.forEach(function (item){
        _this.cookieCollect.forEach(function (ele){
            if(ele.uid===item.uid){
                str+=`
                    <div class="collect_content">
                        <ul class="clearfix" >
                            <li><img src="../img/${item.src}" alt=""></li>
                            <li class="collect_price">￥${item.price} <del>￥${Number(item.price)+100}</del></li>
                            <li class="collect_name"><a href="productdetails.html?uid=${item.uid}&uname=${_this.name}">${item.name}</a></li>
                            <span class="iconfont" uid="${item.uid}">&#xe61e;</span>
                        </ul>
                        <div class="redelete">
                            <p>
                                删除成功啦！<span class="re_deletion">撤销删除</span><br>
                                注意：刷新页面后会彻底删除
                            </p>
                        </div>
                    </div>
                `;
                return false;
            }
        })
    })
    $(".collectWrap").append(str);
}
// 统计藏品数量
ShowCollect.prototype.addCollectNum=function (){
    $("#collect_num").html(this.cookieCollect.length);
}
//删除藏品
ShowCollect.prototype.deleteGood=function (){
    var _this=this;
    var goodArr=[];
    $(".collect_content .iconfont").click(function (){
        goodArr.push({uid:$(this).attr("uid")});
        $(this).parent().next().css("display","block");
        _this.cookieCollect.forEach(function (item,index){
            if(item.uid==$(this).attr("uid")){
                _this.cookieCollect.splice(index,1);
            }
        }.bind(this))
        _this.addCollectNum();
        var date=new Date();
        date.setDate(date.getDate()+10);
        setCookie(_this.name+"collect",JSON.stringify(_this.cookieCollect),date,"/");
    });
    $(".collect_content .re_deletion").click(function (){
        // _this.cookieCollect=_this.cookieCollect.concat(goodId);
        $(this).parent().parent().css("display","none");
        var goodId =$(this).parent().parent().parent().find(".iconfont").attr("uid");
        goodArr.forEach(function (item,index){
            if(item.uid==goodId){
                _this.cookieCollect.push(goodArr.splice(index,1)[0]);
            }
        })
        _this.addCollectNum();
        var date=new Date();
        date.setDate(date.getDate()+10);
        setCookie(_this.name+"collect",JSON.stringify(_this.cookieCollect),date,"/");               
    })
}
var showCollect=new ShowCollect();
showCollect.init();
// [{"uid":"001"},{"uid":"006"},{"uid":"003"}]
