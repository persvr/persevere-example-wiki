/**
 * The starting point for Pintura running as a Jack app.
 */

var Transporter, pinturaApp;
	Transporter = require("transporter/jsgi/transporter").Transporter;
		pinturaApp = //Transporter({loader: require("nodules").forEngine("browser").useLocal().getModuleSource},
			// the main app
			require("pintura/pintura").app;
		require("./app");
	//});
//	require("tunguska/jack-connector").observe("worker", pinturaApp.addConnection);
	// we start the REPL (the interactive JS console) because it is really helpful

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

