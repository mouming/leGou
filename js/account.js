
//导入头部和尾部以及右侧悬浮栏
$(".header").load("header.html",function (){
    if(showaccount.name){
        // $(".header .list1").clone().insertAfter($(".header .list2")).css("float","right");
        // $(".header .list1").eq(0).remove();
        $(".header .list1 li").eq(0).remove();
        $(".header .list1 li").eq(0).html("Hi,<a href='myCenter.html?uname="+showaccount.name+"'>"+showaccount.name+"</a>");
        $(".header .list1 li").eq(1).html("<a href='../index.html?a'>[退出]</a>").css("marginLeft","20px");
        //设置个人中心超链接
        $(".header .list2").find("a").eq(0).attr("href","myCenter.html?uname="+showaccount.name);
    }
})
$(".footer").load("footer.html",function (){
})
$(".sidebar").load("sidebar.html",function (){
    if(showaccount.name){
        $(".side-cart").attr("href","cart.html?uname="+showaccount.name);
        $(".side-collect").attr("href","collect.html?uname="+showaccount.name);
    }
    $(".sidebar").find("a").mouseover(function(){
        $(this).next().css("display","block");
    }).mouseout(function(){
        $(this).next().css("display","none");
    })
})
function showAccount(){
    this.name="";
    this.goodsData=[];
    this.cookieCartsData=[];
    this.addressData={};
    this.userMessage=[];
    this.getOrder="";
    this.key=[];
}
showAccount.prototype.init=function (){
    this.name=this.hasLocationName("uname");
    this.key=JSON.parse(this.hasLocationName("key"));
    this.getCookieData();
    this.getJsonData();
}
//判断url中是否存在name查询串的方法封装
showAccount.prototype.hasLocationName=function (name){
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
showAccount.prototype.getCookieData=function (){
    this.cookieCartsData=JSON.parse(getCookieName(this.name+"carts"));
}
// 获取json 中的数据
showAccount.prototype.getJsonData=function (){
    var _this=this;
    var accountPromise=new Promise(function(resolve,reject){
        $.getJSON("../json/goods.json",function (data){
            resolve(data);
        });
    })
    accountPromise.then(function(data){
        _this.goodsData=data;
        $.get("../php/user.php",{uname:_this.name},function(data){
            if(data){
                _this.userMessage=JSON.parse(data) ; 
            }
            // 显示的内容
            _this.showPage();
            $.getJSON("../json/pca.json",function(data){
                _this.addressData=data;
                //添加收货地址功能
                _this.addAddress();
            })
                
            
        })
    })
    
    
}
showAccount.prototype.showPage=function (){
    var _this=this;
    // 设置返回购物车链接
    $("#return_cart").attr("href","cart.html?uname="+this.name);
    //显示商品列表
    var str="";
    var totalPrice=0;
    this.goodsData.forEach(function (item){
        _this.cookieCartsData.forEach(function (ele){
            _this.key.forEach(function(key){
                if(ele.uid===item.uid&&ele.uid===key){
                    str+=`
                        <ul class="detail clearfix">
                            <li class="detail_picture"><img src="../img/${item.src}" alt=""></li>
                            <li class="detail_content">${item.name}</li>
                            <li class="detail_price">${item.price}.00</li>
                            <li class="detail_number">${ele.num}</li>
                            <li class="detail_cost">${item.price*ele.num}.00</li>
                            <li class="detail_exercisable">有货</li>
                        </ul>
                    `;
                    totalPrice+=Number(item.price*ele.num);
                    return false;
                }
            })
        })
    })
    $(".good_list dd div").html(str);
    $("#total_money").html(totalPrice);
    // 显示用户的收货地址
    var str2="";
    var str3='';
    if(this.userMessage.length!=0){
        var flag=true;
        this.userMessage.forEach(function (item){
            str2+=`
                <dd class="click_message">
                <ol>
                    <li class="myself_name"><span>${item.name}</span><span>${item.phone}</span> </li>
                    <li class="myself_addr">${item.address}</li>
                    <li class="revise"><a  class="alterAddr">修改</a><a  class="removeAddr">删除</a></li>
                </ol>
                <span class="set_default ${item.default}">设置默认</span>
            </dd> 
            `;
            //根据是否设置了default属性设置寄送地址
            if(item.default){
                str3=`
                <h3>寄送至：${item.address}</h3>
                <p>收货人: <span>${item.name}</span> <span>${item.phone}</span></p>
                `;
                flag=false;
            }
        })
        $(".click_message").remove();
        $(".add_addr").before(str2);
        if(flag){
            str3=`
            <h3>寄送至：${this.userMessage[0].address}</h3>
            <p>收货人: <span>${this.userMessage[0].name}</span> <span>${this.userMessage[0].phone}</span></p>
            `;
        }
        //获取默认状态地址
        _this.getAddrDefault();
        //设置默认地址
        _this.setAddrDefault(); 
        //修改收货地址
        _this.reviseAddr();
    }
    $(".to_addr").html(str3);
    //生成订单号
    _this.createOrder(); 
    //提交订单
    this.submitAccount(totalPrice) ;                            
}
showAccount.prototype.addAddress=function (){
    var _this=this;
    var regPhone=/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    $(".add_addr").click(function(){
        $(".tilt").css("display","block");
        $("input,select").val("");
        $(".user_title").css("display","none");
        $(".select_up .bg_check").attr("class","bg_check");
    })
    //收货人姓名,详细地址失去光标事件
    $(".uname,.detail_addr").blur(function(){
        if(this.value===""){
            $(this).next().css("display","inline-block");
        }else{
            $(this).next().css("display","none");
        }
    })
    // 手机号码失去光标事件
    $(".phone").blur(function (){
        if(regPhone.test(this.value)){
            $(this).next().css("display","none");
        }else{
            $(this).next().css("display","inline-block");
        }
    })
    //地区三级联动
    var strProvince="";
    for (const key in _this.addressData) {
        strProvince+=`
        <option value="${key}">${key}</option>
        `;
    }
    $("#province").append(strProvince);
    //地区选择点击事件
    $("#province").click(function(){
        var provinceVal=this.value;
        var strCity="<option value='0'>请选择</option>";
        if(provinceVal!=0){
            for (const key in _this.addressData[provinceVal]) {
                strCity+= `
                <option value="${key}">${key}</option>
                `;
            }
            $("#city").html(strCity);
            $("#city")[0].onclick=function(){
                var cityVal=this.value;
                var strDistrict="<option value='0'>请选择</option>";
                if(cityVal!=0){                        

                    _this.addressData[provinceVal][cityVal].forEach(function(item){
                        strDistrict+= `
                        <option value="${item}">${item}</option>
                        `;
                    })
                }
                $("#district").html(strDistrict);
            }
        }
        $("#city").html(strCity);
        $("#district").html("<option value='0'>请选择</option>");
    })
    $(".pac").click(function(){
        event.stopPropagation();
        if($("#province").val()!=0&&$("#city").val()!=0&&$("#district").val()!=0){
            $(".pac .user_title").css("display","none");
        }else{
            $(".pac .user_title").css("display","inline-block");
        }
    })
    // 默认地址按钮
    $(".bg_check").click(function (event){
        event.preventDefault();
        if($(this).attr("class")=="bg_check"){
            $(this).addClass("bg_checked");
        }else{
            $(this).removeClass("bg_checked");
        }
    })
    //确定按钮
    $(".select_up .aff").click(function(event){
        event.stopPropagation();
        var flag=true;
        $(".user_title").each(function (){
            if($(this).css("display")!=="none"){
                flag=false;
                return false;
            }
        });
        $(".uname,#province,.detail_addr,.phone").each(function (){
            if($(this).val()===""||$(this).val()==0){
                flag=false;
                return false;
            }
        })
        if(flag){
            var addrCity="";
            if($("#city").val()==="市辖区"||$("#city").val()==="县"){
                addrCity="";
            }else{
                addrCity=$("#city").val();
            }
            var addr=$("#province").val()+addrCity+$("#district").val()+$(".detail_addr").val();
            var defaultVal="";
            if($(".select_up .bg_check").hasClass("bg_checked")){
                defaultVal="set_defaulted";
                _this.userMessage.forEach(function(item){
                    item.default="";
                })
            }
            var meObj={
                name:$(".uname").val(),
                phone:$(".phone").val(),
                address:addr,
                default:defaultVal
            }
            _this.userMessage.push(meObj);
            $(".tilt").css("display","none");
            _this.showPage();
            $.post("../php/user.php",{uname:_this.name,address:JSON.stringify(_this.userMessage)},function(res){
            });
        }
    })
    //取消按钮
    $(".off").click(function(event){
        event.stopPropagation();
        $(".tilt").css("display","none");
    })
}
// 获取默认状态地址
showAccount.prototype.getAddrDefault=function (){
    if($(".click_message").find(".set_default").hasClass("set_defaulted")){
        $(".click_message").attr("class","click_message").find(".revise").css("display","none").end().find(".set_default").css("display","none").html("设置默认");
        $(".click_message").find(".set_defaulted").parent().addClass("clicked_message").find(".revise").css("display","block").end().find(".set_defaulted").css("display","block").html("默认设置");
    }
    $(".click_message").hover(function(){
        if(!$(this).find(".set_default").hasClass("set_defaulted")){
            $(this).find(".revise").css("display","block").end().find(".set_default").css("display","block");
        }
    },function(){
        if(!$(this).find(".set_default").hasClass("set_defaulted")){
            $(this).find(".revise").css("display","none").end().find(".set_default").css("display","none");
        }

    })
}            
showAccount.prototype.setAddrDefault=function(){
    var _this=this;
    // 点击设置默认实现切换默认功能
    $(".set_default").click(function (event){
        event.stopPropagation();
        if(!$(this).hasClass("set_defaulted")){
            $(".set_default").attr("class","set_default");
            $(this).addClass("set_defaulted");
            _this.getAddrDefault();
            _this.userMessage.forEach(function(item){
                item.default="";
                if(item.address===$(this).parent().find(".myself_addr").html()){
                    item.default="set_defaulted";
                }
            }.bind(this));
            _this.showPage();
            $.post("../php/user.php",{uname:_this.name,address:JSON.stringify(_this.userMessage)},function(res){
            });
        }
    })
}
showAccount.prototype.reviseAddr=function(){
    var _this=this;
    $(".removeAddr").click(function (event){
        event.stopPropagation();
        $(this).parent().parent().parent().remove();
        _this.userMessage.forEach(function(item ,index){
            if(item.address===$(this).parent().parent().find(".myself_addr").html()){
                _this.userMessage.splice(index,1);
            }
        }.bind(this));
        $.post("../php/user.php",{uname:_this.name,address:JSON.stringify(_this.userMessage)},function(res){
        });
        _this.showPage();
    })
}
//提交订单事件
showAccount.prototype.submitAccount=function (money){
    if($(".to_addr").children().length){
        $(".submit_btn").find("a").off("click");
        $(".submit_btn").find("a").attr("href","pay.html?uname="+this.name+"&money="+money+"&orderKey="+this.getOrder);    
    }else{
        $(".submit_btn").find("a").on("click",function(){
            alert("收货地址不能为空");
        });
        $(".submit_btn").find("a").attr("href","");    
    }
}
// 生成订单号
showAccount.prototype.createOrder=function (){
    var date=new Date();
    this.getOrder=date.getTime()+parseInt(Math.random()*100000);
}
var showaccount= new showAccount();
showaccount.init();
