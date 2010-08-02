var JSON = require("commonjs-utils/json");

pageName = location.search.match(/page=([^&]+)/);
pageName = decodeURIComponent(pageName && pageName[1]);
require("monitor");

document.title = "Editing " + pageName;
var request = require("promised-io/http-client").request;
document.getElementById("main-header").innerHTML = escapeHTML("Editing " + pageName);
request({
	url: "Page/" + pageName,
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
		}).then(function(){
			// redirect to the page once it is saved
			location = "/Page/" + pageName;
		}, errorHandler);
	};

	byId("insert-image").onclick = function(){
		byId("upload-form").action = "/Page/Example?" + document.cookie.match(/pintura-session=\w+/)[0];
		byId("upload-form").style.display = "block";
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
		url: "User/",
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