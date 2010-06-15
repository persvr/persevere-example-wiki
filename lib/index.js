var pinturaApp;
require.reloadable(function(){
	pinturaApp = require("pintura/pintura").app;
	require("app");
});

var nodes = require("multi-node/multi-node").listen({port: 8080, nodes: 4}, 
	require( "http" ).createServer(
		require("jsgi-node").Listener(
			// uncomment this to enable compression with node-compress
			//require("pintura/jsgi/compress").Compress(
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
				])
			)
		//)
	)
);

// having a REPL is really helpful
if(nodes.isMaster){
	require("repl").start().scope.require = require;
};

// this is just to ensure the static analysis preloads the explorer package
false&&require("persevere-client/explorer/explorer.js"); 
