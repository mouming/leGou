//获取min-max之间的随机整数
function getRand(min,max){
	return parseInt(Math.random()*(max - min + 1) + min);
}

//获取十六进制的随机颜色值
function getColor(){
	var str = "0123456789abcdef";
	var color = "#";
	var rand;
	//str有下标 0-15
	//获取0-15的随机数
	//通过这个随机数作为str的下标，
	//获取随机字符
	//获取六个随机字符拼成一个字符串
	for (var i = 0; i < 6; i++) {
		rand = getRand(0,15);
		color += str.charAt(rand);
	}
	return color;
}
//获得随机验证码
function getYZM(num){
	var str = "";
	var ch,randASC;
	for (var i = 0; i < num; i++) {
		//数字字母从ASCII码来
		//随机获取ASCII码
		randASC = getRand(48,122);
		if((randASC >= 58 && randASC <= 64) || (randASC >= 91 && randASC <= 96)){
			i--;
		}else{
			ch = String.fromCharCode(randASC);
			str += ch;
		}
	}
	return str;
}



function dateToString(date){
			
	var week = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
	
	var str = "";
	
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var f = date.getMinutes();
	var s = date.getSeconds();
	var w = date.getDay();
	
	str += y + "年" + getDB(m) + "月" + getDB(d) + "号 ";	
	str += getDB(h) + ":" + getDB(f) + ":" + getDB(s) + " ";	
	str += week[w];
	return str;
}

function getDB(num){
	return num < 10 ? "0" + num : num;
}
//获取两个时间的时间差的秒数
function difTime(startTime,endTime){
	return (endTime.getTime() - startTime.getTime()) / 1000;
}
//通过id名称获取元素对象。
function $id(id){
	return document.getElementById(id);
}

//封装一个兼容ie8获取所有的className命名的元素对象集合
function getEleByClassName(className){
	var eleArr = [];//保存元素对象集合。
	//获取所有的页面中的元素对象集合
	var allEle = document.getElementsByTagName("*");
	//遍历这个集合，得到每一个元素对象
	for (var i = 0; i < allEle.length; i++) {
		
		//判断每一个元素对象的className是否与传递进来的className相等
		if(allEle[i].className === className){
			//如果相等将该元素对象添加到一个数组中
			eleArr.push(allEle[i]);
		}
	}
	//返回数组，这个数组就是元素对象集合
	return eleArr;
}
//兼容ie8获取所有的子元素节点对象集合
function getEleInChidren(supNode){
	var nodesArr = [];
	//获取所有的子节点
	var sub = supNode.childNodes;
	//遍历所有的子节点
	for (var i = 0; i < sub.length; i++) {
		//判断子节点是否是元素节点，
		if(sub[i].nodeType == 1){
			//如果是将节点保存在一个数组中返回
			nodesArr.push(sub[i]);
		}
	}
	return nodesArr;
}

//兼容ie8获取事件对象的button属性
function getButton(eve){
	if(eve){//高版本浏览器
		return eve.button;
	}else{//ie8
		var but = window.event.button;
		switch(but){
			case 1 : 
				return 0;
			case 4 :
				return 1;
			case 2 : 
				return 2;
		}
	}
}

//兼容ie8阻止事件冒泡
function stopProp(e){
	if(e.stopPropagation){//高版本浏览器
		e.stopPropagation();
	}else{//ie8
		e.cancelBubble = true;
	}
}
//兼容ie8阻止事件默认行为
function preventDef(e){
	if(e.preventDefault){//高版本浏览器
		e.preventDefault();
	}else{
		e.returnValue = false;
	}
}
//身份证号验证
function checkIdCode(idCode){
	var idCodeReg = /^[1-9]\d{5}(19\d{2}|20\d{2}|2100)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|x|X)$/;
	var idStr = idCode.toString();
	var y = idStr.substr(6,4);
	var m =	idStr.substr(10,2);
	var d =	idStr.substr(12,2);
	
	var dReg30 = /^(0[1-9]|[12]\d|30)$/;
	var mReg2r = /^(0[1-9]|1\d|2[0-9])$/;
	var mReg2p = /^(0[1-9]|1\d|2[0-8])$/;
	if(idCodeReg.test(idCode)){//
		switch(m){
			case "04":
			case "06":
			case "09":
			case "11":
				//
				if(dReg30.test(d)){
					return true;
				}else{
					return false;
				}
			case "02":
				if(y % 4 == 0 && y % 100 != 0 || y % 400 == 0){
					if(mReg2r.test(d)){
						return true;
					}else{
						return false;
					}
				}else{
					if(mReg2p.test(d)){
						return true;
					}else{
						return false;
					}
				}
		}
		return true;
	}else{
		return false;
	}
}
//去掉字符串左边 空格 
function myTrimLeft(str){
	return str.replace(/^\s+/,"");
};
//去掉字符串右边 空格 
function myTrimRight(str){
	return str.replace(/\s+$/,"");
};
//去掉字符串左右边 空格 
function myTrim(str){
	return str.replace(/(^\s+|\s+$)/g,"");
};	
// 可实现缓冲多属性多物体运动（left/top/width/height/opacity/zIndex）同时也可实现链式运动
function animate(ele,attrObj,callBack,stepTime){
	stepTime=stepTime||20;
	var step,current,flag;
	clearInterval(ele.timer);
	ele.timer=setInterval(function(){
		flag=true;
		for(var attr in attrObj){
			if(attr!=="zIndex"){
				current=parseFloat(getStyle(ele,attr));
				if(attr==="opacity"){
					current=current*100;
				}else{
					current=Math.ceil(current);
				}
				step=(attrObj[attr]-current)/10;
				step=step>0?Math.ceil(step):Math.floor(step);
				if(attr==="opacity"){
					ele.style[attr]=(current+step)/100;
				}else{
					ele.style[attr]=current+step+"px";
				}
				if(attrObj[attr]!=current){
					flag=false;
				}
			}else{
				ele.style.zIndex=attrObj["zIndex"]
			}
		}
		if(flag){
			clearInterval(ele.timer);
			if(callBack){
				callBack();
			}
		}
	},stepTime)
}
//获取外部样式值
function getStyle(ele,attr){
	return window.getComputedStyle?window.getComputedStyle(ele,null)[attr]:ele.currentStyle[attr];
}
