exports.RedirectRoot = function(Redirect, app){
//	var redirector = Redirect("/Page/Example");
var redirector = require("./redirect").Redirect("/Page/Example");
exports.RedirectRoot = function(app){
	return function(request){
		if(request.pathInfo == "/"){
			return redirector(request);
		}
		return app(request);
	};
};
};