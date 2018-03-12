/* eslint-disable */
/**
 * 存储userinfo，包括设置和获取
 */
export default {
  setCookie (name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = name + '=' + escape(value) +
    ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
  },
  getCookie(name) 
  { 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    {
      return unescape(arr[2]);
    }else {
      return null
    }
  } 
}
