var pinturaApp;
require.reloadable(function(){
	pinturaApp = require("pintura/pintura").app;
	require("app");
});

require("jsgi-node").start(
	require("pintura/jsgi/cascade").Cascade([ 
	// cascade from static to pintura REST handling
		// the main place for static files accessible from the web
		require("pintura/jsgi/static").Static({urls:[""],roots:["public"]}),
		require("pintura/jsgi/static").Static({urls:["/explorer"],roots:[require("nodules").getCachePath("persevere-client/")]}),
		require("pintura/jsgi/static").Static({urls:["/js/dojo-persevere"],roots:[require("nodules").getCachePath("persevere-client/")]}),
		// this will provide access to the server side JS libraries from the client
		require("transporter/jsgi/transporter").Transporter({
			loader: require("nodules").forEngine("browser").useLocal().getModuleSource}),
		// make the root url redirect to /Page/Root  
		require("./jsgi/redirect-root").RedirectRoot(
			// main pintura app
			function(request){
				return pinturaApp(request);
			}
		)
]));

// having a REPL is really helpful
require("repl").start().scope.require = require;

// this is just to ensure the static analysis preloads the explorer package
false&&require("persevere-client/explorer/explorer.js"); 
