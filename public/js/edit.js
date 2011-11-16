define(function(require){
var JSON = require("pintura/util/json");

pageName = location.search.match(/page=([^&]+)/);
pageName = decodeURIComponent(pageName && pageName[1]);
require("./monitor");

document.title = "Editing " + pageName;
var request = require("promised-io/http-client").request;
document.getElementById("main-header").innerHTML = escapeHTML("Editing " + pageName);
request({
	url: "/Page/" + pageName,
	headers: {
		"accept": "application/javascript, application/json"
	}
}).then(function(response){
	if(!response.headers.username){
		login();
	}
	var page = eval("(" + response.body.join("") + ")");
	if(typeof page !== "object"){
		page = {
			id: pageName,
			content: ""
		};
	}
	var contentArea = document.getElementById("content-area");
	contentArea.value = page.content;
	var byId = function(id){
		return document.getElementById(id);
	};
	byId("save-button").onclick = function(){
		page.content = contentArea.value;
		request({
			url: "/Page/" + pageName,
			method: "PUT",
			body: JSON.stringify(page),
			headers: {
				"accept": "application/javascript, application/json",
				"content-type": "application/json"
			}
		}).then(function(response){
			if(response.status >= 400){
				errorHandler(response.body);
			}else{
				// redirect to the page once it is saved
				location = "/Page/" + pageName;
			}
		}, errorHandler);
	};

	byId("insert-image").onclick = function(){
		var uploadForm = byId("upload-form");
		uploadForm.action = "/File/?" + document.cookie.match(/pintura-session=\w+/)[0];
		uploadForm.style.display = "block";
		byId("upload-target").onload = function(){
			var imgHref = byId("upload-target").contentWindow.document.getElementsByTagName("link")[2].href;
			uploadForm.style.display = "none";
			byId("content-area").focus();
			document.execCommand("insertHTML", false, '[[Image:' + imgHref + ']]');
		};
	};
}, errorHandler);

function login(){
	document.getElementById("login-form").style.display="block";
	document.getElementById("sign-in").onclick = function(){
		userRpc("authenticate").then(function(){
			document.getElementById("login-form").style.display="none";
			alert("Logged in");
		}, errorHandler);
	};
	document.getElementById("register").onclick = function(){
		userRpc("createUser").then(function(){
			alert("Registered");
		}, errorHandler);
	};
}

function userRpc(method, params){
	return request({
		url: "/User/",
		method: "POST",
		body: JSON.stringify({
			id:"call-id",
			method: method,
			user: document.getElementById("user").value,
			password: document.getElementById("password").value
		}),
		headers: {
			"accept": "application/javascript, application/json",
			"content-type": "application/json"
		}
	}).then(function(response){
		var body = eval('(' + response.body.join("") + ')');
		if(response.status > 300){
			throw new Error(body);
		}
		return body;
	});
	}

function errorHandler(error){
	alert(error);
}


function escapeHTML(html){
	return html.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;");
}
});