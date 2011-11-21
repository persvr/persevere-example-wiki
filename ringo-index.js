/**
 * The starting point for Pintura running as a Ringo app.
 */

var pinturaApp =	// the main app
		require("pintura/pintura").app,
	settings = require("perstore/util/settings");
require("./app");

if(require.main == module){
    var server = new (require("ringo/httpserver").Server)({
    	appName: "app", 
    	appModule: module.id,
    	port: settings.port
    });
    server.getContext("/public").serveStatic("public");
    server.getContext("/packages").serveStatic(require('pintura/util/packages-dir'));
    server.start();
	if(settings.repl){
		require("ringo/shell").start();
	}
}

exports.app = 
	 	require("./jsgi/redirect-root").RedirectRoot( 
		 	// main Pintura handler
			function(request){
				return pinturaApp(request);
			}
		);

