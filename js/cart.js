     
//导入头部和尾部以及右侧悬浮栏
$(".header").load("header.html",function (){
    if(show.name){
        $(".header .list1").clone().insertAfter($(".header .list2")).css("float","right");
        $(".header .list1").eq(0).remove();
        $(".header .list1 li").eq(0).remove();
        $(".header .list1 li").eq(0).html("Hi,<a href='myCenter.html?uname="+show.name+"'>"+show.name+"</a>");
        $(".header .list1 li").eq(1).html("<a href='../index.html?a'>[退出]</a>").css("marginLeft","20px");
        //设置个人中心超链接
        $(".header .list2").find("a").eq(0).attr("href","myCenter.html?uname="+show.name);
    }
})
$(".footer").load("footer.html",function (){
})
$(".sidebar").load("sidebar.html",function (){
    if(show.name){
        $(".side-cart").attr("href","cart.html?uname="+show.name);
        $(".side-collect").attr("href","collect.html?uname="+show.name);
    }
    $(".sidebar").find("a").mouseover(function(){
        $(this).next().css("display","block");
    }).mouseout(function(){
        $(this).next().css("display","none");
    })
})
// 面向对象创建显示购物车及其功能的构造函数
function ShowCart(){
    this.name="";
    this.cookieCarts=[];
    this.jsonData=[];
    this.addressData={};
}
// 页面初始化
ShowCart.prototype.init=function (){
    // 将url中获取的用户名存入name中
    this.name= this.hasLocationName("uname");
    // 获取json中商品数据
    this.getJsonData();
    
}
//判断url中是否存在name查询串的方法封装
ShowCart.prototype.hasLocationName=function (name){
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
ShowCart.prototype.getCookieData=function (){
    this.cookieCarts=JSON.parse(getCookieName(this.name+"carts"));
}
// 获取json 中的商品数据
ShowCart.prototype.getJsonData=function (){
    var _this=this;
    $.getJSON("../json/goods.json",function (data){
        _this.jsonData=data;
        // 判断页面显示的内容
        _this.judgePage();
    });
    $.getJSON("../json/pca.json",function(data){
        _this.addressData=data;
        // console.log(this.addressData)
            //地址三级联动
        _this.addressCheck(".address",".select_address",".tabs",".addr_content");
    })
}
// 显示不同状态对应的页面布局
ShowCart.prototype.judgePage=function (){
    if(this.name){
        if(!(getCookieName(this.name+"carts")=="[]"||(!getCookieName(this.name+"carts")))){
            $(".cart-goods").css("display","block");
            $(".no-goods").css("display","none");
            // 显示具体商品
            this.showByCookie();
            //结算栏吸底效果
            this.suctionBottom();
            // 为生成的元素添加购物车功能
            //全选全不选功能
            this.allcheckbox();
            //加减商品数量
            this.addOrCut();
            //删除商品
            this.deleteGood();
            // 统计选中商品的价格和数量
            this.statisticsNum();
            // 统计购物车中的商品数量
            this.addCartNum();
            $(".total_continue a").attr("href","../index.html?uname="+this.name);
        }else{
            $(".cart-goods").css("display","none");
            $("#loginCart a").attr("href","../index?uname"+this.name);
            $(".no-goods").css("display","block").find("#loginCart").css("display","block").end().find("#unloginCart").css("display","none");
        }
    }else{
        $(".cart-goods").css("display","none");
        $(".no-goods").css("display","block").find("#unloginCart").css("display","block").end().find("#loginCart").css("display","none");
    }
}
//结算栏吸底效果
ShowCart.prototype.suctionBottom=function (){
    var offset=$(".total").offset();
    onscroll=function (){
        var maxH=(document.documentElement||document.body).clientHeight+(document.documentElement||document.body).scrollTop;
        if(offset.top>=maxH-$(".total").outerHeight()){
            $(".total").css({
                position:"fixed",
                bottom:0
            })
        }else{
            $(".total").css({
                position:"relative",
            })
        }
    }.bind(this)
}
// 登录成功后的购物车应显示的内容
ShowCart.prototype.showByCookie=function (){
    var _this=this;
    var str="";
    // 获取cookie数据
    this.getCookieData();
    this.jsonData.forEach(function (item){
        _this.cookieCarts.forEach(function (ele){
            if(ele.uid===item.uid){
                str+=`
                    <ul class="detail clearfix">
                        <li class="detail_select"><input type="checkbox" class="checkbox " name="select_sdl"></li>
                        <li class="detail_picture"><img src="../img/${item.src}" alt=""></li>
                        <li class="detail_content">${item.name}</li>
                        <li class="detail_price">${item.price}.00</li>
                        <li class="detail_number">
                            <div class="detail_count">
                                <strong count="cut">-</strong>
                                <input type="text" value="${ele.num}" class="detail_num " uid="${item.uid}">
                                <strong count="add">+</strong>
                            </div>
                        </li>
                        <li class="detail_cost">${item.price*ele.num}.00</li>
                        <li class="detail_exercisable">删除</li>
                    </ul>
                `;
                return false;
            }
        })
    })
    $(".total").before(str);
}

// 全选全不选功能
ShowCart.prototype.allcheckbox=function (){
    var _this=this;
    $("input[name='select_all']").click(function (){
        if($(this).prop("checked")){
            $("input[name='select_sdl']").prop("checked",true);
            $("input[name='select_all']").prop("checked",true);
        }else{
            $("input[name='select_all']").prop("checked",false);
            $("input[name='select_sdl']").prop("checked",false);
        }
        _this.statisticsNum();
        _this.addCartNum();
    })
    $("input[name='select_sdl']").click(function (){
        var flag=true;
        $("input[name='select_sdl']").each(function(index,item){
            if(!item.checked){
                flag=false;
                return false;
            }
        })
        $("input[name='select_all']").prop("checked",flag);
        _this.statisticsNum();
        _this.addCartNum();
    })
}
// 增减商品数量
ShowCart.prototype.addOrCut=function (){
    // console.log($("strong[count='cut']"))
    var _this=this;
    //添加数量点击事件
    $("strong[count='add']").click(function (){
        _this.updataGood(this);
        _this.updataCartCookie();
        _this.statisticsNum();
        _this.addCartNum();
        
    })
    $("strong[count='cut']").click(function (){
        //
        _this.updataGood(this);
        _this.updataCartCookie();
        _this.statisticsNum(); 
        _this.addCartNum();
    })
    $(".detail_num").blur(function (){
        _this.updataGood(this);
        _this.updataCartCookie();
        _this.statisticsNum(); 
        _this.addCartNum();
    })
}
//根据此件商品数量计算价格
ShowCart.prototype.updataGood=function (ele){
    var num=$(ele).parent().find(".detail_num").val()-0;
    if($(ele).attr("count")==="add"){
        num++;
    }else if($(ele).attr("count")==="cut"){
        num--;
    }
    $(ele).parent().find(".detail_num").val(num);
    var parentUl=$(ele).parent().parent().parent();
    var cost=parentUl.find(".detail_price").html()*num;
    parentUl.find(".detail_cost").html(cost+".00");
    parentUl.find("input[name=select_sdl]").prop("checked",true);
    //判断复选框是否全部选中
    var flag=true;
    $("input[name='select_sdl']").each(function(index,item){
        if(!item.checked){
            flag=false;
            return false;
        }
    })
    $("input[name='select_all']").prop("checked",flag);
    if(num==0){
        parentUl.remove();
    }
}
//更新购物车cookie信息
ShowCart.prototype.updataCartCookie=function (){
    this.cookieCarts=[];
    var _this=this;
    $(".detail").each(function (index){
        _this.cookieCarts.push({
            uid:$(this).find(".detail_num").attr("uid"),
            num:$(this).find(".detail_num").val()
        })
    })
    var date=new Date();
    date.setDate(date.getDate()+10);
    setCookie(this.name+"carts",JSON.stringify(this.cookieCarts),date,"/");
    if(JSON.stringify(this.cookieCarts)=="[]"){//当购物车内没有商品时重新判断页面显示;
        this.judgePage();
    }
}
//删除商品
ShowCart.prototype.deleteGood=function(){
    var _this=this;
    $(".detail_exercisable").click(function (){
        $(this).parent().remove();
        _this.updataCartCookie();
        _this.statisticsNum();
        _this.addCartNum();
    })
    $("#deleteSelect").click(function (){
        $(".detail ").each(function (index){
            if($(this).find(".checkbox").prop("checked")){
                $(this).remove();
            }
        })
        _this.updataCartCookie();
        _this.statisticsNum();
        _this.addCartNum();
    })
}

// 统计选中商品的价格和数量
ShowCart.prototype.statisticsNum=function (){
    var sum=0;
    var totalPrice=0;
    $(".detail ").each(function (index){
        if($(this).find(".checkbox").prop("checked")){
            sum+=Number($(this).find(".detail_num").val());
            totalPrice+=Number($(this).find(".detail_cost").html());
        }
    })
    $("span[name='totalSum']").html(sum);
    $("i[name=totalPrice]").html(totalPrice);
    //统计选中商品的信息生成结算购物车的超链接
    this.orderCart();
}

// 统计购物车商品的数量
ShowCart.prototype.addCartNum=function (){
    var sum=0;
    $(".detail ").each(function (index){
        sum+=Number($(this).find(".detail_num").val());
    })
    $("#goods-num").html(sum);
}
ShowCart.prototype.addressCheck=function (targetEle,showEle,addrTab,addrContent){
    var _this=this;
    var str1='';
    for (const key in this.addressData) {
        str1+=`
            <li title="${key}">${key}</li>
        `;
    }
    $("#province").append(str1);
    $(targetEle).click(function (){
        $(showEle).css("display","block");
        $(addrTab).delegate("span","click",function(){
            event.stopPropagation();
            $(this).parent().find("span").removeClass("click_border");
            $(this).addClass("click_border");
            $(addrContent).find("ul").css("display","none").eq($(this).index()).css("display","block");
        });
        //关闭选择框
        $("#close_address").click(function (){
            event.stopPropagation();
            $(showEle).css("display","none");
        })
        //点击省份生成对应的区
        $("#province li").click(function(){
            event.stopPropagation();
            var provinceName=$(this).attr("title");
            var str2="";
            for (const key in _this.addressData[provinceName]) {
                str2+=`
                    <li title="${key}">${key}</li>
                `;
            }
            $(addrTab).find("span").removeClass("click_border");
            $("#city_tab").addClass("click_border");
            $("#province_tab").html(provinceName);
            $("#city_tab").html("市").css("display","inline-block");
            $("#district_tab").html("区/县");
            $(addrContent).find("ul").css("display","none");
            $("#city").css("display","block").html(str2);
            //点击市生成对应的区
            $("#city li").click(function (){
                event.stopPropagation();
                var cityName="";
                var str3="";
                _this.addressData[provinceName][$(this).attr("title")].forEach(function(item){
                    str3+=`
                        <li title="${item}">${item}</li>
                    `;
                })
                $(addrTab).find("span").removeClass("click_border");
                $("#district_tab").addClass("click_border").html("区/县");
                if($(this).attr("title")==="市辖区"||$(this).attr("title")==="县"){
                    $("#city_tab").css("display","none");
                }else{
                    cityName=$(this).attr("title");
                    $("#city_tab").html(cityName);
                }
                $(addrContent).find("ul").css("display","none");
                $("#district").css("display","block").html(str3);
                //点击区/县，关闭选择框
                $("#district li").click(function (){
                    event.stopPropagation();
                    var districtName=$(this).attr("title")
                    $("#district_tab").html(districtName);
                    $(showEle).css("display","none");
                    $("#show_address").html(provinceName+cityName+districtName);
                })
            })
        })
    })
}
//结算购物车
ShowCart.prototype.orderCart=function (){
    if(this.name){
        var accountArr=[];
        $(".detail ").each(function (index){
            if($(this).find(".checkbox").prop("checked")){
                accountArr.push($(this).find(".detail_num").attr("uid"));
            }
        })
        if(accountArr.length){
            $(".total_right").find("a").off("click");
            $(".total_right").find("a").attr("href","account.html?uname="+this.name+"&key="+JSON.stringify(accountArr))
        }else{
            $(".total_right").find("a").on("click", function(){
                alert("结算商品数不能为0");
            });
            $(".total_right").find("a").attr("href","#");  
        }
    }
}
var show=new ShowCart();
show.init();
// [{"uid":"001","num":2},{"uid":"006","num":3},{"uid":"003","num":4}]
