exports.RedirectRoot = function(Redirect, app){
	var redirector = Redirect("/Page/Example");
	return function(request){
		if(request.pathInfo == "/"){
			return redirector(request);
		}
		return app(request);
	};
};