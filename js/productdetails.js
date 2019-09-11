// var card_info = document.getElementById("card_info");
// onscroll = function(){
//     var stop =  document.documentElement.scrollTop|| document.body.scrollTop;
//     if(stop > 728) {
//         // card_info.style.position = "fixed";
//         // card_info.style.top = 0;
//         this.console.log("card_info.style");
//     }else{
//         card_info.style.position = "static";
//     }
// }

//吸顶
var card_info = document.getElementById("card_info");
document.onscroll = function(){
    var stop =  document.documentElement.scrollTop|| document.body.scrollTop;
    if(stop > 728) {
        card_info.style.position = "fixed";
        card_info.style.zIndex="10";
        card_info.style.top = 0;
        hide_info.style = "display:block";
    }else{
        card_info.style.position = "static";
        hide_info.style = "display:none";
    }
}
    //放大镜
    $(".product_info_Left").mouseenter(function () {
    var s=(document.documentElement.clientWidth-1196)/2
    $(".mas").show().mousedown(function (e) {
        var x=e.offsetX;
        var y=e.offsetY;
        $(".mas").mousemove(function (e) {
            e.stopPropagation();
            var l=e.clientX-x-s;
            var t=e.pageY-y-238;
            if(l<0){
                l=0;
            }else if(l>273){
               l=273
            }
            if(t<0){
                t=0
            }else if(t>273){
               t=273
            }
            $(".mas").css({
                "left": l,
                "top":t
            })
            // box.style.left=l+"px";
            // box.style.top=t+"px";
            $(".mask img").css({
                "left": -(800*l)/448,
                "top" : -(800*t)/448
            })
            // big.style.left=-(800*l)/448+"px";
            // big.style.top=-(800*t)/448+"px";
        })
    }) 
    $(".mask").show() 
})
$(".product_info_Left").mouseleave(function (e) {
    e.stopPropagation( );
    $(".product_info_Left").mousemove=null;
    $(".mas").hide();
    $(".mask").hide(); 
})

//选项卡
// $(".card_info").on("click","li",function(){
//     $(".aa").eq($(this).index()).show().sibings(".aa").hide();
// //    console.log()
// })
$(".cc").click(function(){
    $(".bb").eq($(this).attr("index")).show().siblings(".bb").hide();
    $(this).find("span").addClass("hh").end().siblings(".cc").find("span").removeClass("hh");    
});


//购物车
function ShowDetail(){
    this.name="";
    this.goodId="";
    this.cartCookie=[];
    this.jsonData=[];
    this.goodSrc="";
}
ShowDetail.prototype.init=function(){
    //获取名字
    this.name=this.hasLocationName("uname");
    //获取id
    this.goodId=this.hasLocationName("uid");
    // 获取json数据
    this.getJsonData();
}
// var cartName=hasLocationName("uname");

// })

//判断url中是否存在name查询串的方法封装
ShowDetail.prototype.hasLocationName=function(name){
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
// 获取json数据
ShowDetail.prototype.getJsonData=function(){
    var _this=this;
    $.getJSON("../json/goods.json",function(res){
        _this.jsonData=res;
        // 对页面进行渲染
        _this.showPage();
        // 过去cookie信息
        _this.getCookieCart();
        _this.saveMessage();
    })
}
// 显示页面
ShowDetail.prototype.showPage=function(){
    var _this=this;
    var str1="";
    this.jsonData.forEach(function(item){
        if(item.uid==_this.goodId&&(_this.goodId<6)){
            str1=`
                <div class="title">
                        <span class="title_one"><a>乐融自营</a></span>
                         <span class="title_two"><a>${item.name}</a></span>
                </div>
                    <div class="read_info">
                        <div class="slogan"><a>${item.discribe[0]} | ${item.discribe[1]} | ${item.discribe[2]}</a></div>
                            <div class="learn_more">
                                <a href="#"><span>超5 X55钢铁侠限量版来袭</span></a>
                        </div>
                    </div>
                <div class="price_info" id="price_info">
                    <span style="color: #888888">价格:</span>
                    <span class="price_danjia">￥ ${item.price} 起</span>
                </div>
                <div class="mask"><img src="../img/${item.src}" alt="" id="big"></div>
                <div class="size_info" id="size_info">
                    <span style="color: #888888">尺寸</span>
                    <span class="size_cc">${item.size}</span>
                </div>
                <div class="price_allinfo" id="price_allinfo">
                    <span style="color: #888888">总计：</span>
                    <span class="price_allpr">￥ ${item.price}.00</span>
                    <a class="submitCart"><span class="price_addcart">加入购物车 </span></a>
                </div> 
            `;
            _this.goodSrc=item.src;
        }else if(item.uid==_this.goodId&&(_this.goodId>5)){
            str1=`
            <div class="title">
                    <span class="title_one"><a>乐融自营</a></span>
                        <span class="title_two"><a>${item.name}</a></span>
            </div>
            <div class="read_info">
                <div class="slogan"><a>${item.fitter[0]} | ${item.fitter[1]?item.fitter[1]:"X55N"} | ${item.fitter[2]?item.fitter[2]:"X43 S"}</a></div>
                    <div class="learn_more">
                        <a href="#"><span>超5 X55钢铁侠限量版来袭</span></a>
                </div>
            </div>
            <div class="price_info" id="price_info">
                <span style="color: #888888">价格:</span>
                <span class="price_danjia">￥ ${item.price} 起</span>
            </div>
            <div class="mask"><img src="../img/${item.src}" alt="" id="big"></div>
            <div class="size_info" id="size_info">
                <span style="color: #888888">颜色</span>
                <span class="size_cc">黑色</span>
            </div>
            <div class="price_allinfo" id="price_allinfo">
                <span style="color: #888888">总计：</span>
                <span class="price_allpr">￥ ${item.price}.00</span>
                <a class="submitCart"><span class="price_addcart">加入购物车 </span></a>
            </div> 
                
            `;
            _this.goodSrc=item.src;
        }
    })
    $("#big_img  img").attr("src","../img/"+_this.goodSrc);
    $("#product_detail").html(str1);
    //设置返回主页链接
    $(".bread_nav").find("a").attr("href","../index.html?uname="+_this.name);
}
//保存加入购物车的信息
ShowDetail.prototype.saveMessage=function(){

    var _this=this;
    $(".submitCart").click(function(event){
        console.log(1);

        event.stopPropagation();
        if(_this.name){
            var flag=true;
            _this.cartCookie.forEach(function(item){
                if(item.uid==_this.goodId){
                    item.num++;
                    flag=false;
                    return false;
                }
            })
            if(flag){
                _this.cartCookie.push({uid:_this.goodId,num:1});
            }
            //设置cookie
            _this.setCookieCart();
            //显示提示框
            $(".tilt").css("display","block");
            $(".gogocart").attr("href","cart.html?uname="+_this.name);
        }else{
            $(".gogocart").attr("href","");
            alert("你还未登录，请登录后再添加购物车");
        }
    })
    $(".gogocart,#xx_bt").click(function(){
        $(".tilt").css("display","none");
    })
}
//保存cookieCart中的数据
ShowDetail.prototype.getCookieCart=function(){
    if(getCookieName(this.name+"carts")){
        this.cartCookie=JSON.parse(getCookieName(this.name+"carts"));
    }else{
        this.cartCookie=[];
    }
}
//设置cookieCart中的数据
ShowDetail.prototype.setCookieCart=function(){
    var date=new Date();
    date.setDate(date.getDate()+10);
    setCookie(this.name+"carts",JSON.stringify(this.cartCookie),date,"/");
}

var showDetail=new ShowDetail();
showDetail.init();
