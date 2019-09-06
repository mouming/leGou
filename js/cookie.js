// 获取cookie
function getCookieName(cName){
    var str=document.cookie;
    if(str){
        var arr=str.split("; ");
        for(var i=0;i<arr.length;i++){
            if(arr[i].split("=")[0]===cName){
                return arr[i].split("=")[1];
            }
        }
    }
    return "";
}
// 设置cookie
function setCookie(cName,cVla,date,path){
    if(!(date instanceof Date)){
        path=date;
    }
    date=date||"";
    if(path){
        document.cookie=cName+"="+cVla+";expires="+date+";path="+path;
    }else{
        document.cookie=cName+"="+cVla+";expires="+date;
    }
}
// 删除cookie
function deleteCookie(cName){
    document.cookie=cName+"=;expires="+new Date(0);
}