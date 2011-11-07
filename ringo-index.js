/**
 * The starting point for Pintura running as a Ringo app.
 */

var pinturaApp =	// the main app
		require("pintura/pintura").app;
require("./app");

if(require.main == module){
    var server = new (require("ringo/httpserver").Server)({appName: "app", appModule: module.id});
    server.getContext("/public").serveStatic("public");
    server.getContext("/packages").serveStatic("C:/packages");
    server.start();
}

exports.app = 
	 	require("./jsgi/redirect-root").RedirectRoot( 
		 	// main Pintura handler
			function(request){
				return pinturaApp(request);
			}
		);

