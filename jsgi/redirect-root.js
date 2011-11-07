var redirector = require("pintura/jsgi/redirect").Redirect("/Page/Example");
exports.RedirectRoot = function(app){
	return function(request){
		if(request.pathInfo == "/"){
			return redirector(request);
		}
		return app(request);
	};
};
