window.onload = function() {
	setDisplay();
}
function getCookie(name)
{
	var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg))
       return unescape(arr[2]);
    else
       return null;
}
function setDisplay() {
	var userid = getCookie("username");
	var userpw = getCookie("password");
	var sessions = getCookie("sessionSec");
	getPerInfo(userid,userpw);
	getScore(userid,sessions);
	// getScoreYear(userid,userpw,sessions);
}
//获取用户个人信息
function getPerInfo(id,pw) {
	var username = document.getElementById('userName');
	$.ajax({
		dataType : 'jsonp',
		data : {
			username : id,
			password : pw
		},
		url : "http://scoreapi.xiyoumobile.com/users/info",
		success : function(data) {
			username.innerHTML = data.result.name;
			showPerInfo(data);
			console.log(data);
		}
	});
}
//获取用户成绩
function getScore() {
	var userid = getCookie("username");
	var sessions = getCookie("sessionSec");
	$.ajax({
		dataType : 'jsonp',
		data : {
			username : userid,
			session : sessions
		},
		url : "http://scoreapi.xiyoumobile.com/score/all",
		success : function(data) {
			console.log(data);
			showScore(data);
			findScore(data);
		}
	});
}
// var score = getScore();
//获取用户学年成绩
// function getScoreYear(id,pw,sessions) {
// 	$.ajax({
// 		dataType : 'jsonp',
// 		data : {
// 			username : id,
// 			password : pw,
// 			session : sessions
// 		},
// 		url : "http://scoreapi.xiyoumobile.com/score/year",
// 		success : function(data) {
// 			// console.log(data);
// 		}
// 	})
// }
//展示成绩
function showScore(score) {
	var select = document.getElementsByTagName('select')[0];
	for(var i = 0 ; i < score.result.score.length ; i++) {
		for(var j = 0 ; j < score.result.score[i].Terms.length ; j++ ) {
			var option = document.createElement('option');
			select.appendChild(option);
			option.innerHTML = score.result.score[i].year + "学年 | 第" + score.result.score[i].Terms[j].Term + "学期";
			option.value = i + "+" + score.result.score[i].Terms[j].Term;
		}
	}
	select.onchange = function() {
		selectTerm(score);
	}
	initScore(score);
}
//默认显示成绩
function initScore(data) {
	var options = document.getElementsByTagName('select')[0].getElementsByTagName('option');
	var latest = options[options.length - 1];
	latest.selected = "selected";
	var thisYear = data.result.score[data.result.score.length - 1];
	var thisTerm = thisYear.Terms[thisYear.Terms.length - 1];
	displayScore(thisTerm);
}
function selectTerm(score) {
	var select = document.getElementsByTagName('select')[0];
	var tyear = select.options[select.selectedIndex].value.split('+')[0];
	var tterm = select.options[select.selectedIndex].value.split('+')[1] - 1;
	var thisYear = score.result.score[tyear];
	var thisTerm = thisYear.Terms[tterm];
	displayScore(thisTerm);
}
function displayScore(thisTerm) {
	var display = document.getElementById('p_score_display');
	display.innerHTML = "";
	console.log(thisTerm);
	for(var i = 0 ; i < thisTerm.Scores.length ; i++) {
		var eveProject = document.createElement('div');
		eveProject.className = "p_score_one";
		display.appendChild(eveProject);
		var evePName = document.createElement('div');
		evePName.className = "p_project";
		evePName.innerHTML = thisTerm.Scores[i].Title;
		eveProject.appendChild(evePName);
		var evePScore = document.createElement('div');
		evePScore.className = "p_project_score";
		if(thisTerm.Scores[i].EndScore < 60 || thisTerm.Scores[i].EndScore == '不合格') {
			evePScore.style.background = "red";
		}
		evePScore.innerHTML = "最终成绩 : " + thisTerm.Scores[i].EndScore;
		eveProject.appendChild(evePScore);
	}
	var projects = document.getElementsByClassName('p_score_one');
	for(var j = 0 ; j < projects.length ; j++) {
		projects[j].onclick = function(j) {
			return function() {
				var dispOnePro = document.getElementById('dispOnePro');
				dispOnePro.onclick = function() {
					dispOnePro.style.display = "none";
					display.style.display = "block";
				}
				display.style.display = "none";
				dispOnePro.style.display = "block";
				var thisProject = dispOnePro.getElementsByClassName('dop_title')[0];
				thisProject.innerHTML = thisTerm.Scores[j].Title;
				var tPSpec = dispOnePro.getElementsByClassName('dop_spe')[0].getElementsByTagName('span');
				tPSpec[0].innerHTML = "最终成绩 : " + thisTerm.Scores[j].EndScore;
				tPSpec[1].innerHTML = "平时成绩 : " + thisTerm.Scores[j].UsualScore;
				tPSpec[2].innerHTML = "期中成绩 : " + thisTerm.Scores[j].RealScore;
				tPSpec[3].innerHTML = "状态 : " + thisTerm.Scores[j].Exam;
				tPSpec[4].innerHTML = "课程类型 : " + thisTerm.Scores[j].Type;
			}
		}(j);
	}
}
function showList() {
	$("#showlist").animate({
		left : 0
	},500);
	$("#showlist").click(function(){
		$("#showlist").animate({
			left : "-40%"
		},500);
	});
	$(".p_con").click(function(){
		$("#showlist").animate({
			left : "-40%"
		},500);
	});
}
function showPerInfo(data) {
	var personInfo = document.getElementById('personInfo');
	var dispPInfo = document.getElementById('dispPInfo');
	var p_con = document.getElementsByClassName('p_con')[0];
	var dpi_spe = document.getElementsByClassName('dpi_spe')[0].getElementsByTagName('span');
	personInfo.onclick = function() {
		dispPInfo.style.display = "block";
		p_con.style.display = "none";
		dpi_spe[0].innerHTML = "学号 : " + data.result.username;
		dpi_spe[1].innerHTML = "姓名 : " + data.result.name;
		dpi_spe[2].innerHTML = "性别 : " + data.result.sex;
		dpi_spe[3].innerHTML = "生日 : " + data.result.brithday;
		dpi_spe[4].innerHTML = "所在班级 : " + data.result.class;
		dpi_spe[5].innerHTML = "所在学院 : " + data.result.college;
	}
	dispPInfo.onclick = function() {
		dispPInfo.style.display = "none";
		p_con.style.display = "block";
	}
}
function findScore(data) {
	var display = document.getElementById('p_score_display');
	var fScore = document.getElementById('findScore');
	var p_con = document.getElementsByClassName('p_con')[0];
	var dispPInfo = document.getElementById('dispPInfo');
	fScore.onclick = function() {
		p_con.style.display = "block";
		dispPInfo.style.display = "none";
	}
}