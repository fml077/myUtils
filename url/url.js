// 获取url中的参数值 方法一
var getUrlParams = function (name, url){
  if(!url) url = window.lacation.href
  name = name.replace(/[[\]]/g, '\\$&')
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  let results = regex.exec(url)
  if (!results) return null
  if(!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// 获取url中的参数值 方法二
var getQueryString =function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

// 获取url中的参数值 方法三
function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for(var i = 0; i < strs.length; i ++) {
       theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
// 方法三调用方式
/*var Request = new Object();
Request = GetRequest();
var 参数1,参数2,参数3,参数N;
参数1 = Request['参数1'];
参数2 = Request['参数2'];
参数3 = Request['参数3'];
参数N = Request['参数N'];*/


// 拼接url和参数  方法一
var addParamsToUrl = function (url, params) {
  if (type of params != 'object') {
    return
  }
  let key 
  let baseUrl = [url + '?']
  for (key in params) {
    baseUrl.push ('&' + key + '=' + params[key])
  }
  baseUrl[1] = baseUrl[1].substring(1)
  return baseUrl.join('')
}