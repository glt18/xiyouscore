window.onload = function() {
	getVerCode();
}
function getVerCode() {
	var idcodeImg = document.getElementById('idcodeImg') ;
	$.ajax({
		dataType : 'jsonp',
		url : "http://scoreapi.xiyoumobile.com/users/verCode",
		success : function(data){
			idcodeImg.src = data.result.verCode;
			document.cookie = "session=" +  data.result.session;
		}
	});
}
function getCookie(name)
{
	var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg))
       return unescape(arr[2]);
    else
       return null;
}
function login() {
	var userid = document.getElementById('userId').value;
	var userpw = document.getElementById('userPW').value;
	var verCodeInput = document.getElementById('identifyCode').value;
	var session = getCookie("session");
	//console.log(session);
	getInfo(userid,userpw,session,verCodeInput);
}
function getInfo(id,pw,session,verCode) {
	$.ajax({
		dataType : 'jsonp',
		data : {
			username : id,
			password : pw,
			session : session,
			verCode : verCode
		},
		url : "http://scoreapi.xiyoumobile.com/users/login",
		success : function(data) {
			if (data.error == true) {
				alert("输入错误！");
				window.location.reload();
			}else {
				console.log(data);
				document.cookie = "sessionSec=" + data.result.session;
			    document.cookie = "username=" + id;
				document.cookie = "password=" + pw;
				window.location.href = "xiyouScore.html";
			}
		}
	});
}
