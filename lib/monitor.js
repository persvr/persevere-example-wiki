var JSON = require("commonjs-utils/json"),
	request = require("promised-io/http-client").request;
	
//pageName = typeof pageName === "undefined" ? decodeURIComponent(location.pathname.match(/[^\/]*$/)[0]) : pageName;
function monitor(){
	// not going to care about IE6 for this demo
	request({
		method: "POST",
		url: "/Page/",
		headers: {
			"content-type": "message/json",
			"accept": "message/json"
		},
		body: JSON.stringify({
			method: "subscribe",
			to: "*"
		})
	}).then(function(response){
		var events = eval("(" + response.body.join("") + ")");
		if(response.status > 300){
			throw new Error(events);
		}
		var popup = document.body.appendChild(document.createElement("div"));
		popup.className = "status";
		for(var i = 0; i < events.length; i++){
			var pageName = decodeURIComponent(events[i].from.match(/[^\/]*$/)[0]);
			popup.innerHTML += "<p>Page <a href=\"/Page/" + pageName + "\">" + pageName + "</a> was changed</p>";
		}
		setTimeout(function(){
			document.body.removeChild(popup);
		}, 3000);
		monitor();
	});
}
setTimeout(monitor, 1000);
