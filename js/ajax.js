function getXHR(){
	var xhr = null;
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else{
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xhr;
}
//对象参数序列化
function paramiter(obj){
	var arr = [];
	for(var key in obj){
		arr.push(key + "=" + encodeURIComponent(obj[key]));
	}
	return arr.join("&");
}

//get封装
function ajaxGet(url,data,callBack){
	//如果没有data参数传递，实参只有两个回调函数占据了data的位置
	if(data instanceof Function){
		callBack = data;//将函数赋值给callBack
		data = undefined;//data没有就是undefined;
	}
	//data的处理：有数据和没数据的处理
	//data传递进来的是一个对象，将对象序列化操作paramiter(data)
	data = data ? "&" + paramiter(data) : ""; //data = uname=tom&pwd=110
	//url首先要做缓存处理
	url += "?rand=" + new Date().getTime() + data;
	var xhr = getXHR();
	xhr.open("get",url);
	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				//dom操作把数据显示在页面
				callBack(xhr.responseText);
			}else{
				//xhr.status xhr.statusText;
				callBack("响应出错：提示：" + xhr.status+",错误原因："+xhr.statusText);
			}
		}
	}
	
}
//post封装
function ajaxPost(url,data,callBack){
	console.log(data);
	if(data instanceof Function){
		callBack = data;//将函数赋值给callBack
		data = undefined;//data没有就是undefined;
	}
	data = data ? paramiter(data) : "";
	
	var xhr = getXHR();
	xhr.open("POST",url);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send(data);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				//console.log(xhr.responseText);
				//dom操作把数据显示在页面
				callBack(xhr.responseText);
			}else{
				//xhr.status xhr.statusText;
				callBack("响应出错：提示：" + xhr.status+",错误原因："+xhr.statusText);
			}
		}
	}
	
}
function ajax(obj){//接收对象参数
	/*
	 * var obj = {
			method:"GET",
			url : "ajaxFZ.php",
			data : {uname : "张三",pwd : "123"},
			sucusses:function(data){},
			error:function(err){}
		}
	 */
	//data的处理 存在时行序列化，不存在置为空
	obj.data = obj.data ? paramiter(obj.data) : "";
	var xhr = getXHR();
	if(obj.method.toLowerCase() === "get"){
		//处理缓存 问题
		obj.url += "?rand=" + new Date().getTime();
		//如果data存在将obj.data添加到url的后面
		obj.data ? obj.url += "&" + obj.data : "";
	}
	xhr.open(obj.method,obj.url);
	if(obj.method.toLowerCase() === "post"){
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(obj.data);
	}else{
		xhr.send();
	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				obj.success(xhr.responseText);
			}else{
				if(obj.error)
					obj.error("响应出错：提示：" + xhr.status+",错误原因："+xhr.statusText);
			}
		}
	}
}

function prmiseAjax(obj){
	var pro = new Promise(function(resolve,reject){
		obj.data = obj.data ? paramiter(obj.data) : "";
		var xhr = getXHR();
		if(obj.method.toLowerCase() === "get"){
			obj.url += "?rand=" + new Date().getTime();
			obj.data ? obj.url += "&" + obj.data : "";
		}
		xhr.open(obj.method,obj.url);
		
		if(obj.method.toLowerCase() === "post"){
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xhr.send(obj.data);
		}else{
			xhr.send();
		}
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					//obj.success(xhr.responseText);
					resolve(xhr.responseText)
				}else{
					//if(obj.error)
						//obj.error("响应出错：提示：" + xhr.status+",错误原因："+xhr.statusText);
					reject("响应出错：提示：" + xhr.status+",错误原因："+xhr.statusText);
				}
			}
		}
	});
	return pro;
}